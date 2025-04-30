import { scoreSchema } from "@repo/common/zod";
import cors from "cors";
import dotenv from "dotenv";
import express, { Response } from "express";
import { createClient } from "redis";
import { ZodError } from "zod";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

console.log(process.env.REDIS_HOST, process.env.REDIS_PORT);
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || "6380";

const client = createClient({
  url: `redis://${redisHost}:${redisPort}`,
  socket: {
    connectTimeout: 10000,
    keepAlive: 10000,
    reconnectStrategy: (retries, cause) => {
      const maxRetries = 10;
      if (retries > maxRetries) {
        return false;
      }
      return Math.min(retries * 50, 2000);
    },
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
  if (err.message.includes("ECONNREFUSED")) {
    console.log("Redis server not available. Retrying connection...");
  }
});

client.on("connect", () => {
  console.log("Connected to Redis");
  // Clear any pending operations that might have failed during disconnection
  client.flushDb();
});

client.on("reconnecting", () => {
  console.log("Redis client is reconnecting...");
});

client.on("end", () => {
  console.log("Redis connection ended");
});

let clients: Response[] = [];

app.delete(
  "/api/leaderboard/un-register/:contestId/:userId",
  async (req, res) => {
    const { contestId, userId } = req.params;
    // Remove the user ID and score from the sorted set for the contest
    await client.zRem(`leaderboard:${contestId}`, userId);

    // Remove the user details from Redis hash data structure
    await client.hDel(`userDetails:${contestId}`, userId);

    res.json({ msg: "User removed from leaderboard successfully" });
  }
);

app.post("/api/leaderboard/register/:contestId", async (req, res) => {
  const { contestId } = req.params;
  try {
    const validBody = scoreSchema.parse(req.body);
    const { userId, score, country, userName } = validBody;

    // Add the user ID and score to the sorted set for the contest
    await client.zAdd(`leaderboard:${contestId}`, { score, value: userId });

    // Store the user details in Redis hash data structure
    const userDetails = JSON.stringify({ userName, country });
    await client.hSet(`userDetails:${contestId}`, userId, userDetails);

    res.json({ msg: "User added successfully" });
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({
        msg: err.errors[0]?.message,
      });
    } else if (err instanceof Error) {
      res.status(500).json({
        msg: err.message,
      });
    } else {
      res.status(500).json({
        msg: "An unknown error occurred while adding the user",
      });
    }
  }
});

app.post("/api/leaderboard/update/:contestId", async (req, res) => {
  const { contestId } = req.params;
  try {
    const validBody = scoreSchema.parse(req.body);
    const { userId, score, country, userName } = validBody;

    // Add the user ID and score to the sorted set for the contest
    await client.zAdd(`leaderboard:${contestId}`, { score, value: userId });

    // Store the user details in Redis hash data structure
    const userDetails = JSON.stringify({ userName, country });
    await client.hSet(`userDetails:${contestId}`, userId, userDetails);

    // Broadcast the updated leaderboard to all the connected clients, only if the action is 'update'
    const leaderboard = await getLeaderboardWithDetails(parseInt(contestId));
    sendEvent(leaderboard);
    res.json({ msg: "Leaderboard updated successfully" });
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({
        msg: err.errors[0]?.message,
      });
      return;
    } else if (err instanceof Error) {
      res.status(500).json({
        msg: err.message,
      });
      return;
    } else {
      res.status(500).json({
        msg: "An unknown error occurred while adding the score",
      });
      return;
    }
  }
});

app.get("/api/leaderboard/:contestId", async (req, res) => {
  const { contestId } = req.params;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  // Immediately send the HTTP headers to the client.
  res.flushHeaders();

  clients.push(res);

  // Send the initial leaderboard data
  try {
    const leaderboard = await getLeaderboardWithDetails(parseInt(contestId));
    res.write(`data: ${JSON.stringify(leaderboard)}\n\n`);
  } catch (err) {
    console.error("Error retrieving initial leaderboard:", err);
  }
  // Heartbeat to keep the connection alive
  const keepAliveInterval = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 20000); // 20 seconds

  req.on("close", () => {
    clearInterval(keepAliveInterval);
    clients = clients.filter((client) => client !== res);
  });
});

async function getLeaderboardWithDetails(contestId: number) {
  const redisLeaderboard = await client.zRangeWithScores(
    `leaderboard:${contestId}`,
    0,
    -1,
    { REV: true }
  );
  const userDetails = await client.hGetAll(`userDetails:${contestId}`);
  const leaderboardData = redisLeaderboard.map((user, index) => {
    const userDetailJson = userDetails[user.value];
    const userDetail = userDetailJson ? JSON.parse(userDetailJson) : {};

    return {
      username: userDetail.userName || "Unknown",
      score: user.score,
      rank: index + 1,
      country: userDetail.country || "N/A",
    };
  });

  return leaderboardData;
}

function sendEvent(data: any) {
  clients.forEach((client) => {
    try {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      console.error("Error sending event:", err);
    }
  });
}

// Ensure Redis is connected before starting the server
const startServer = async () => {
  try {
    await client.connect();
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Leaderboard event endpoint is at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  clients.forEach((client) => client.end());
  client.quit();
});
