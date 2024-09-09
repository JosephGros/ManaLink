import { NextRequest, NextResponse } from "next/server";


const protectedRoutes = ['/home'];

export function middleware(req: NextRequest) {

    const { cookies } = req;

    const token = cookies.get('token')?.value;

    const isProtectedRoute = protectedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
      );
    
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    
    if (token && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/home/:path*'],
  };