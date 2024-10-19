import { NextRequest, NextResponse } from "next/server";


const protectedRoutes = ['/', '/home', '/profile', '/admin', '/chat', '/friend', '/messages', '/moderator', '/otherUserProfile', '/playgroups', '/user-settings', '/request-pass-reset', '/reset-password', '/search-user'];

export function middleware(req: NextRequest) {

    const { cookies } = req;

    const token = cookies.get('token')?.value;

    const isProtectedRoute = protectedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
      );
    
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/start', req.url));
    }
    
    if (token && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '//:path*', 
        '/home/:path*', 
        '/profile/:path*',
        '/admin/:path*',
        '/chat/:path*',
        '/friend/:path*',
        '/messages/:path*',
        '/moderator/:path*',
        '/otherUserProfile/:path*',
        '/playgroups/:path*',
        '/user-settings/:path*',
        '/request-pass-reset/:path*',
        '/reset-password/:path*',
        '/search-user/:path*'
    ],
};