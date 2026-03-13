import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis with strict placeholder check
const redis = (
    process.env.UPSTASH_REDIS_REST_URL && 
    process.env.UPSTASH_REDIS_REST_URL !== "YOUR_UPSTASH_REDIS_REST_URL" &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.UPSTASH_REDIS_REST_TOKEN !== "YOUR_UPSTASH_REDIS_REST_TOKEN"
) ? new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
}) : null;

const LIMIT = 5; // max requests for login
const WINDOW = 15 * 60; // 15 minutes in seconds

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();
    const adminSession = request.cookies.get("admin_session")?.value;
    const ip = (request as any).ip || request.headers.get("x-forwarded-for") || "unknown";

    // 1. Inject Security Headers
    const securityHeaders = {
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.turnstile.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://res.cloudinary.com https://ui-avatars.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://static.turnstile.cloudflare.com; frame-src 'self' https://static.turnstile.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
        "X-XSS-Protection": "1; mode=block",
    };

    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // 2. Rate Limiting for Login with Error Handling
    if (pathname === "/api/auth/login" && redis) {
        try {
            const key = `ratelimit:login:${ip}`;
            const count = await redis.incr(key);
            
            if (count === 1) {
                await redis.expire(key, WINDOW);
            }

            if (count > LIMIT) {
                return new NextResponse("Too Many Requests", { status: 429, headers: response.headers });
            }
        } catch (error) {
            console.error("[MIDDLEWARE] Redis rate limiting error:", error);
            // Fall through to allow login if Redis fails
        }
    }

    // 3. Protect /admin routes
    if (pathname.startsWith("/admin")) {
        if (adminSession !== "authenticated") {
            const url = new URL("/login", request.url);
            return NextResponse.redirect(url);
        }
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*", "/api/auth/login", "/api/db/:path*"],
};
