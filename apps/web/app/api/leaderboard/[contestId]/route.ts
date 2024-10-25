import { NextResponse } from "next/server";
import { createClient } from "redis";

// Use environment variables for Redis connection options
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || '6379';

const client = createClient({
    url: `redis://${redisHost}:${redisPort}`
});

client.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

// Connect to Redis server
client.connect();

export async function GET() {
    try {
        // Set a value in Redis
        await client.set("testKey", "Hello, Redis!");

        // Get the value from Redis
        const value = await client.get('testKey');

        return NextResponse.json({ message: value });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Error connecting to Redis' }, { status: 500 });
    }
}