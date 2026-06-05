import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for feedback (replace with database in production)
interface FeedbackEntry {
  id: string;
  pagePath: string;
  isHelpful: boolean;
  comment?: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
}

// Simple in-memory store (use Redis/DB in production)
const feedbackStore: FeedbackEntry[] = [];

import { checkRateLimit } from '@/lib/rate-limit';

const RATE_LIMIT_MAX = 10; // max 10 feedbacks per hour per IP

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')?.split(',')[0]
      || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip, RATE_LIMIT_MAX)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { pagePath, isHelpful, comment } = body;
    
    // Validate required fields
    if (!pagePath || typeof isHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: pagePath and isHelpful are required' },
        { status: 400 }
      );
    }
    
    // Validate pagePath format
    if (typeof pagePath !== 'string' || pagePath.length > 500) {
      return NextResponse.json(
        { error: 'Invalid pagePath format' },
        { status: 400 }
      );
    }
    
    // Validate comment length if provided
    if (comment && (typeof comment !== 'string' || comment.length > 2000)) {
      return NextResponse.json(
        { error: 'Comment must be a string with maximum 2000 characters' },
        { status: 400 }
      );
    }
    
    // Create feedback entry
    const feedback: FeedbackEntry = {
      id: generateId(),
      pagePath,
      isHelpful,
      comment: comment?.trim() || undefined,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined,
      referrer: request.headers.get('referer') || undefined,
    };
    
    // Store feedback
    feedbackStore.push(feedback);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Feedback recorded successfully',
        id: feedback.id 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve feedback stats (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    // In production, add authentication here
    // const session = await getSession();
    // if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { searchParams } = new URL(request.url);
    const pagePath = searchParams.get('pagePath');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    
    let results = feedbackStore;
    
    // Filter by page path if provided
    if (pagePath) {
      results = results.filter(f => f.pagePath.includes(pagePath));
    }
    
    // Calculate statistics
    const stats = {
      total: results.length,
      helpful: results.filter(f => f.isHelpful).length,
      notHelpful: results.filter(f => !f.isHelpful).length,
      withComments: results.filter(f => f.comment).length,
      recent: results
        .slice(-limit)
        .reverse()
        .map(({ id, pagePath, isHelpful, comment, timestamp }) => ({
          id,
          pagePath,
          isHelpful,
          hasComment: !!comment,
          timestamp,
        })),
    };
    
    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
