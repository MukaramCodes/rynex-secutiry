import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signJWT } from '@/lib/portal/auth';
import { comparePassword } from '@/lib/password';

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  // fallback — in dev this may be '::1' (IPv6 loopback)
  return '127.0.0.1';
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // ─── IP Access Control Check ──────────────────────────────────────────
    const clientIp = getClientIp(request);
    const isAdmin = ['ADMIN', 'CEO'].includes(user.role);

    // ADMIN and CEO roles are allowed to log in from any IP address
    if (!isAdmin) {
      const normalizedAllowed = (user.allowedIp || '192.168.1.17').trim();
      const normalizedClient = clientIp.trim();

      if (normalizedAllowed !== normalizedClient) {
        // Check if there's already a pending request from this IP
        const existingRequest = await db.loginRequest.findFirst({
          where: {
            userId: user.id,
            requestedIp: normalizedClient,
            status: 'PENDING',
          },
        });

        if (!existingRequest) {
          // Create a new login request
          await db.loginRequest.create({
            data: {
              userId: user.id,
              requestedIp: normalizedClient,
              currentAllowedIp: normalizedAllowed,
              status: 'PENDING',
            },
          });

          // Notify all ADMIN and CEO users
          const admins = await db.user.findMany({
            where: { role: { in: ['ADMIN', 'CEO'] }, isActive: true },
            select: { id: true },
          });

          await db.notification.createMany({
            data: admins.map((admin) => ({
              userId: admin.id,
              title: '🚨 Unauthorized Login Attempt',
              body: `${user.name} (${user.email}) attempted to login from IP ${normalizedClient}. Their authorized IP is ${normalizedAllowed}. Please review in Access Control.`,
              link: '/portal/access-control',
            })),
          });
        }

        return NextResponse.json(
          {
            error: 'IP_NOT_AUTHORIZED',
            message:
              'Login from this IP address is not authorized. Your administrator has been notified and will review your request.',
            requestedIp: normalizedClient,
          },
          { status: 403 }
        );
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    // Create session token
    const token = await signJWT({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    });

    // Save login timestamp
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Create response and set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    });

    // Secure cookie setup
    response.cookies.set('portal_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred during login' },
      { status: 500 }
    );
  }
}
