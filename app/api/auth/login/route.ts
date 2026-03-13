import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    console.log("[AUTH] Login attempt received");
    try {
        const { email, password, turnstileToken } = await request.json();

        // Check if env vars are present
        if (!process.env.ADMIN_PASSWORD) {
            console.error("[AUTH] ADMIN_PASSWORD is NOT SET in environment variables!");
        }

        // 1. Verify Turnstile token
        console.log("[AUTH] Verifying Turnstile token...");
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA",
                response: turnstileToken,
            }),
        });

        const verifyData = await verifyResponse.json();
        console.log("[AUTH] Turnstile verify result:", verifyData.success);

        if (!verifyData.success && process.env.NODE_ENV === "production") {
            console.error("[AUTH] Turnstile verification failed:", verifyData['error-codes']);
            return NextResponse.json(
                { error: `Security check failed: ${verifyData['error-codes']?.join(', ') || 'Unknown error'}. Check your secret key.` },
                { status: 403 }
            );
        }

        // 2. Verify email and password
        const expectedEmail = process.env.ADMIN_EMAIL || "admin@youthcamping.in";
        const expectedPass = process.env.ADMIN_PASSWORD || "Parth@315";

        console.log("[AUTH] Comparing credentials...");
        if (password === expectedPass && email === expectedEmail) {
            console.log("[AUTH] Success! Setting session cookie...");
            const cookieStore = await cookies();
            
            cookieStore.set("admin_session", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });

            return NextResponse.json({ success: true });
        }

        console.warn("[AUTH] Invalid credentials provided");
        return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
        );
    } catch (error: any) {
        console.error("[AUTH] Internal error:", error);
        return NextResponse.json(
            { error: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}
