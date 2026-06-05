import { NextResponse } from 'next/server';

const START_TIME = Date.now();

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    commit: process.env.GIT_COMMIT_SHA || 'unknown',
    uptime_seconds: Math.floor((Date.now() - START_TIME) / 1000),
  });
}
