import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { email, password, turnstileToken } = await request.json();

        // 1. Verify Turnstile token
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: turnstileToken,
            }),
        });

        const verifyData = await verifyResponse.json();
        if (!verifyData.success && process.env.NODE_ENV === "production") {
            return NextResponse.json(
                { error: "Security check failed. Please try again." },
                { status: 403 }
            );
        }

        // 2. Verify email and password
        if (password === process.env.ADMIN_PASSWORD && (!process.env.ADMIN_EMAIL || email === process.env.ADMIN_EMAIL)) {
            const cookieStore = await cookies();
            
            // Set a simple auth cookie
            cookieStore.set("admin_session", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: "Invalid password" },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
