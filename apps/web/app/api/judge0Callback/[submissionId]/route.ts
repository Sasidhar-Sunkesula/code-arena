import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const body = await req.json();
    console.log("Callback received:", body);
    return NextResponse.json({ msg: "Callback received" });
}