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

// Rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 50;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  const validRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0] || 'unknown';
    
    if (!checkRateLimit(ip)) {
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
    
    console.log('Chat feedback received:', {
      messageId,
      feedback,
      timestamp: entry.timestamp,
    });
    
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
