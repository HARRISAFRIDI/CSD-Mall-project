import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = "super-secret-key-csd-store"; // Must match the one in auth.ts
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')?.value;
    
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(session, key, {
        algorithms: ["HS256"],
      });
      
      const user = payload.user as any;
      
      if (!user || user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
