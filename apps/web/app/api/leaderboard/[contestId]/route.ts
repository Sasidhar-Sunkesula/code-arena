import { authOptions } from "@/lib/auth";
import EventSource from "eventsource";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// This is required to enable streaming
export const dynamic = 'force-dynamic';

// Proxy API for SSE
export async function GET(req: NextRequest, { params }: { params: { contestId: string } }) {
    const session = await getServerSession(authOptions);
    const contestId = parseInt(params.contestId);
    if (isNaN(contestId)) {
        return NextResponse.json({
            msg: "Contest Id is invalid"
        }, { status: 400 });
    }

    if (!session || !session.user) {
        return NextResponse.json({
            msg: "You need to login to access leaderboard"
        }, { status: 401 });
    }
    // TransformStream -> Creates a readable and writable stream.
    const stream = new TransformStream();
    // The writable stream is used to write data received from the SSE endpoint.
    const writer = stream.writable.getWriter(); // It is used to write chunks of data to the stream.
    // The TextEncoder encodes the string data received from the SSE endpoint into binary data.
    const encoder = new TextEncoder();

    const resp = new EventSource(`${process.env.LEADERBOARD_SERVER_URL}/api/leaderboard/${contestId}`)
    resp.onmessage = async (e) => {
        await writer.write(encoder.encode(`event: message\ndata: ${e.data}\n\n`));
    }

    resp.onerror = async () => {
        // Close the EventSource and the writer if an error occurs
        resp.close();
        await writer.close();
    }
    req.signal.addEventListener("abort", async () => {
        // Handle client disconnection
        console.log("abort");
        resp.close();
        await writer.close();
    });
    // The readable stream from TransformStream is returned as the response to the client.
    return new Response(stream.readable, {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive'
        },
    });
}
