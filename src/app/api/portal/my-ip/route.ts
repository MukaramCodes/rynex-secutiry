import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  
  let ip = '127.0.0.1';
  
  if (forwarded) {
    ip = forwarded.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp.trim();
  }
  
  return NextResponse.json({ ip });
}
