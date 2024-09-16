import { NextRequest, NextResponse } from "next/server";
// We are not using zod here because, this endpoint will only be hit
// by judge0 server and there is no point of showing runtime error 
// messages to a server   
interface Body {

}
export async function PUT(req: NextRequest) {
    const body = await req.json();
    console.log("Callback received:", body);
    return NextResponse.json({ msg: "Callback received" });
}