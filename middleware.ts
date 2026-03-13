import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const adminSession = request.cookies.get("admin_session")?.value;

    // 1. Protect /admin routes
    if (pathname.startsWith("/admin")) {
        if (adminSession !== "authenticated") {
            const url = new URL("/login", request.url);
            return NextResponse.redirect(url);
        }
    }

    // 2. Protect sensitive /api/db actions
    if (pathname === "/api/db" && request.method === "POST") {
        // We can't easily check the body in middleware without breaking the request for the route handler
        // But we can check the cookie for ANY POST request to /api/db as a baseline
        // Note: Public quote pages only use GET-like POST requests (action: 'get' or 'getBySlug')
        // However, since we're hardening, we'll implement the body check INSIDE the route handler itself
        // for more granular control. But for now, let's at least block /api/db POST if no session 
        // IF we want to be super strict. 
        // ACTUALLY, /quote/[slug] needs to call /api/db (POST) to 'get' data.
        // So we SHOULD NOT block all /api/db POSTs here.
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/db/:path*"],
};
