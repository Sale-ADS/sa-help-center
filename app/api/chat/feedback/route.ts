import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/rate-limit';
import { insertRow, runQuery, hashIp, BQ_PROJECT, BQ_DATASET } from '@/lib/bigquery';

const RATE_LIMIT_MAX = 50;
const TABLE = 'chat_feedback';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')?.split(',')[0]
      || 'unknown';

    if (!checkRateLimit(ip, RATE_LIMIT_MAX)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const { messageId, feedback } = body;

    if (!messageId || !feedback || !['helpful', 'not-helpful'].includes(feedback)) {
      return NextResponse.json({ error: 'Invalid feedback data' }, { status: 400 });
    }

    const row = {
      feedback_id: crypto.randomUUID(),
      message_id: String(messageId),
      chat_session: body.chatSession ? String(body.chatSession) : null,
      helpful: feedback === 'helpful',
      reason: body.reason ? String(body.reason).slice(0, 2000) : null,
      locale: body.locale === 'en' ? 'en' : 'es',
      model: body.model ? String(body.model) : null,
      page_context: body.pageContext
        ? String(body.pageContext)
        : request.headers.get('referer') || null,
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

    return NextResponse.json({ success: true, id: row.feedback_id });
  } catch (error) {
    console.error(JSON.stringify({
      severity: 'ERROR',
      event: 'chat_feedback_post_error',
      error: error instanceof Error ? error.message : String(error),
    }));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stats = await runQuery<{ total: number; helpful: number; not_helpful: number }>(
      `SELECT
         COUNT(*) AS total,
         COUNTIF(helpful) AS helpful,
         COUNTIF(NOT helpful) AS not_helpful
       FROM \`${BQ_PROJECT}.${BQ_DATASET}.${TABLE}\`
       WHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)`,
    );

    const recent = await runQuery(
      `SELECT
         feedback_id AS id,
         message_id,
         helpful,
         reason,
         locale,
         model,
         created_at
       FROM \`${BQ_PROJECT}.${BQ_DATASET}.${TABLE}\`
       WHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
       ORDER BY created_at DESC
       LIMIT 20`,
    );

    const s = stats[0] || { total: 0, helpful: 0, not_helpful: 0 };
    return NextResponse.json({
      total: Number(s.total),
      helpful: Number(s.helpful),
      notHelpful: Number(s.not_helpful),
      satisfactionRate: s.total > 0 ? Math.round((Number(s.helpful) / Number(s.total)) * 100) : 0,
      recent,
    });
  } catch (error) {
    console.error(JSON.stringify({
      severity: 'ERROR',
      event: 'chat_feedback_get_error',
      error: error instanceof Error ? error.message : String(error),
    }));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
