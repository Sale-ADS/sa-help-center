import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/rate-limit';
import { insertRow, runQuery, hashIp, BQ_PROJECT, BQ_DATASET } from '@/lib/bigquery';

const RATE_LIMIT_MAX = 10;
const TABLE = 'page_feedback';

function inferLocaleFromSlug(slug: string): string {
  if (slug.startsWith('/en') || slug.startsWith('en/')) return 'en';
  return 'es';
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')?.split(',')[0]
      || 'unknown';

    if (!checkRateLimit(ip, RATE_LIMIT_MAX)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { pagePath, isHelpful, comment } = body;

    if (!pagePath || typeof isHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: pagePath and isHelpful are required' },
        { status: 400 },
      );
    }
    if (typeof pagePath !== 'string' || pagePath.length > 500) {
      return NextResponse.json({ error: 'Invalid pagePath format' }, { status: 400 });
    }
    if (comment !== undefined && (typeof comment !== 'string' || comment.length > 2000)) {
      return NextResponse.json(
        { error: 'Comment must be a string with maximum 2000 characters' },
        { status: 400 },
      );
    }

    const row = {
      feedback_id: crypto.randomUUID(),
      page_slug: pagePath,
      locale: body.locale === 'en' ? 'en' : inferLocaleFromSlug(pagePath),
      helpful: isHelpful,
      comment: comment ? String(comment).trim() : null,
      ip_hash: hashIp(ip),
      user_agent: request.headers.get('user-agent') || null,
      created_at: new Date().toISOString(),
    };

    try {
      await insertRow(TABLE, row);
    } catch (e) {
      console.error(JSON.stringify({
        severity: 'ERROR',
        event: 'bq_insert_failed',
        table: TABLE,
        error: e instanceof Error ? e.message : String(e),
      }));
      return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: 'Feedback recorded successfully', id: row.feedback_id },
      { status: 201 },
    );
  } catch (error) {
    console.error(JSON.stringify({
      severity: 'ERROR',
      event: 'feedback_post_error',
      error: error instanceof Error ? error.message : String(error),
    }));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pagePath = searchParams.get('pagePath');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);

    const where = pagePath
      ? 'WHERE page_slug LIKE @pagePathPattern AND created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)'
      : 'WHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)';
    const params: Record<string, unknown> = pagePath
      ? { pagePathPattern: `%${pagePath}%` }
      : {};

    const stats = await runQuery<{
      total: number; helpful: number; not_helpful: number; with_comments: number;
    }>(
      `SELECT
         COUNT(*) AS total,
         COUNTIF(helpful) AS helpful,
         COUNTIF(NOT helpful) AS not_helpful,
         COUNTIF(comment IS NOT NULL) AS with_comments
       FROM \`${BQ_PROJECT}.${BQ_DATASET}.${TABLE}\`
       ${where}`,
      params,
    );

    const recent = await runQuery(
      `SELECT
         feedback_id AS id,
         page_slug AS pagePath,
         helpful AS isHelpful,
         comment IS NOT NULL AS hasComment,
         created_at AS timestamp
       FROM \`${BQ_PROJECT}.${BQ_DATASET}.${TABLE}\`
       ${where}
       ORDER BY created_at DESC
       LIMIT @lim`,
      { ...params, lim: limit },
    );

    const s = stats[0] || { total: 0, helpful: 0, not_helpful: 0, with_comments: 0 };
    return NextResponse.json({
      total: Number(s.total),
      helpful: Number(s.helpful),
      notHelpful: Number(s.not_helpful),
      withComments: Number(s.with_comments),
      recent,
    });
  } catch (error) {
    console.error(JSON.stringify({
      severity: 'ERROR',
      event: 'feedback_get_error',
      error: error instanceof Error ? error.message : String(error),
    }));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
