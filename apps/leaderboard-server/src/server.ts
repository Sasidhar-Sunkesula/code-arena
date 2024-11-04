import express, { Response } from "express"
import cors from "cors"
import { createClient } from "redis";
import { z, ZodError } from "zod";

const app = express();

app.use(cors());
app.use(express.json());

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || '6379';

const client = createClient({
    url: `redis://${redisHost}:${redisPort}`,
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Connected to Redis'));

client.connect();

let clients: { id: number, res: Response }[] = [];

const scoreSchema = z.object({
    userId: z.string(),
    score: z.number(),
    userName: z.string(),
    country: z.string()
})

const registeredUsers = z.array(scoreSchema);

app.post("/api/leaderboard/:contestId", async (req, res: any) => {
    const { contestId } = req.params;
    try {
        const validBody = scoreSchema.parse(req.body);
        const { userId, score, country, userName } = validBody;

        // Add the user ID and score to the sorted set for the contest
        await client.zAdd(`leaderboard:${contestId}`, { score, value: userId });

        // Store the user details in a hash map
        await client.hSet(`userId:${userId}`, {
            userName: userName,
            country: country,
        })
        res.json({ msg: "Score added successfully" });
        // Broadcast the updated leaderboard
        const leaderboard = await client.zRangeWithScores(`leaderboard:${contestId}`, 0, -1, { REV: true });
        sendEvent(leaderboard);
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                msg: err.errors[0]?.message
            });
        } else if (err instanceof Error) {
            return res.status(500).json({
                msg: err.message
            });
        } else {
            return res.status(500).json({
                msg: "An unknown error occurred while adding the score"
            });
        }
    }
})

app.post("/api/leaderboard/initialize/:contestId", async (req, res: any) => {
    const { contestId } = req.params;
    try {
        const validBody = registeredUsers.parse(req.body);
        // Initialize Redis Sorted Set and Hash Map

        /* A pipeline allows you to batch multiple Redis commands and execute them in a single round-trip to the Redis server. 
         This can improve performance by reducing the number of network requests.
        */

        const pipeline = client.multi();
        validBody.forEach(user => {
            // Add user to the sorted set with an initial score
            pipeline.zAdd(`leaderboard:${contestId}`, { score: user.score, value: user.userId });

            // Store user details in a hash map
            pipeline.hSet(`user:${user.userId}`, {
                userName: user.userName,
                country: user.country
            });
        });
        // This line executes all the commands in the pipeline
        await pipeline.exec();

        res.json({ msg: "Leaderboard initialized successfully" });
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                msg: err.errors[0]?.message
            });
        } else if (err instanceof Error) {
            return res.status(500).json({
                msg: err.message
            });
        } else {
            return res.status(500).json({
                msg: "An unknown error occurred while initializing the leaderboard for the contest"
            });
        }
    }
})

app.get("/api/leaderboard/:contestId", async (req, res: any) => {
    const { contestId } = req.params;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Immediately send the HTTP headers to the client.
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res: res
    };
    clients.push(newClient);

    // Send the initial leaderboard data
    try {
        const leaderboard = await getLeaderboardWithDetails(contestId);
        res.write(`data: ${JSON.stringify(leaderboard)}\n\n`);
    } catch (err) {
        console.error('Error retrieving initial leaderboard:', err);
    }
    // Heartbeat to keep the connection alive
    const keepAliveInterval = setInterval(() => {
        res.write(': keep-alive\n\n');
    }, 20000); // 20 seconds

    req.on('close', () => {
        clearInterval(keepAliveInterval);
        clients = clients.filter(client => client.id !== clientId);
    });
})

async function getLeaderboardWithDetails(contestId: string) {
    const redisLeaderboard = await client.zRangeWithScores(`leaderboard:${contestId}`, 0, -1, { REV: true });

    const leaderboardData = await Promise.all(redisLeaderboard.map(async (entry, index) => {
        const userDetails = await client.hGetAll(`user:${entry.value}`);
        return {
            userId: entry.value,
            username: userDetails.userName || 'Unknown',
            score: entry.score,
            rank: index + 1,
            country: userDetails.country || 'N/A'
        };
    }));

    return leaderboardData;
}

function sendEvent(data: any) {
    clients.forEach(client => {
        try {
            client.res.write(`data: ${JSON.stringify(data)}\n\n`);
        } catch (err) {
            console.error('Error sending event:', err);
        }
    });
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    clients.forEach(client => client.res.end());
    client.quit();
});
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Leader board event endpoint is at http://localhost:${PORT}`)
})