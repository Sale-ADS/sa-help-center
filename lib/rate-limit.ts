const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// In-memory rate limit store (use Redis in production)
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(ip: string, maxRequests: number): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  const validRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (validRequests.length >= maxRequests) {
    return false;
  }

  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return true;
}
