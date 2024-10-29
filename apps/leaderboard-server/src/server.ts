import express, { Response } from "express"
import cors from "cors"
import { createClient } from "redis";
import z from "zod";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || '6379';

const client = createClient({
    url: `redis://${redisHost}:${redisPort}`,
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Connected to Redis'));

client.connect();

let clients: { id: number, res: Response }[] = [];

const urlSchema = z.number({
    message: "Contest Id must be a valid number"
})

app.get("/api/leaderboard/:contestId", (req, res: any) => {
    const { contestId } = req.params;
    const result = urlSchema.safeParse(Number(contestId))
    if (!result.success) {
        return res.status(400).json({
            msg: result.error.errors
        })
    }
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

    // Heartbeat to keep the connection alive
    const keepAliveInterval = setInterval(() => {
        res.write(': keep-alive\n\n');
    }, 20000); // 20 seconds

    req.on('close', () => {
        clearInterval(keepAliveInterval);
        clients = clients.filter(client => client.id !== clientId);
    });
})

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
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Leader board event endpoint is at http://localhost:${PORT}`)
})