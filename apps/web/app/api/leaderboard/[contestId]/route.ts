import { authOptions } from "@/lib/auth";
import EventSource from "eventsource";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// This is required to enable streaming
export const dynamic = 'force-dynamic';

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
    const stream = new TransformStream()
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    const resp = new EventSource(`${process.env.LEADERBOARD_SERVER_URL}/api/leaderboard/${contestId}`)
    resp.onmessage = async (e) => {
        await writer.write(encoder.encode(`event: message\ndata: ${e.data}\n\n`));
    }

    resp.onerror = async () => {
        resp.close();
        await writer.close();
    }
    req.signal.addEventListener("abort", async () => {
        console.log("abort");
        resp.close();
        await writer.close();
    });
    return new Response(stream.readable, {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive'
        },
    });
}
