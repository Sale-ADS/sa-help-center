import { NextRequest, NextResponse } from 'next/server';

// Store chat feedback for improving responses
interface ChatFeedback {
  id: string;
  messageId: string;
  feedback: 'helpful' | 'not-helpful';
  timestamp: string;
  query?: string;
  response?: string;
}

const feedbackStore: ChatFeedback[] = [];

import { checkRateLimit } from '@/lib/rate-limit';

const RATE_LIMIT_MAX = 50;

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0] || 'unknown';
    
    if (!checkRateLimit(ip, RATE_LIMIT_MAX)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { messageId, feedback, query, response } = body;
    
    if (!messageId || !feedback || !['helpful', 'not-helpful'].includes(feedback)) {
      return NextResponse.json(
        { error: 'Invalid feedback data' },
        { status: 400 }
      );
    }
    
    const entry: ChatFeedback = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      messageId,
      feedback,
      timestamp: new Date().toISOString(),
      query,
      response,
    };
    
    feedbackStore.push(entry);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Chat feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const helpful = feedbackStore.filter(f => f.feedback === 'helpful').length;
    const notHelpful = feedbackStore.filter(f => f.feedback === 'not-helpful').length;
    const total = feedbackStore.length;
    
    return NextResponse.json({
      total,
      helpful,
      notHelpful,
      satisfactionRate: total > 0 ? Math.round((helpful / total) * 100) : 0,
      recent: feedbackStore.slice(-20).reverse(),
    });
    
  } catch (error) {
    console.error('Chat feedback GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
