import * as RateLimiterFlexible from "https://dev.jspm.io/rate-limiter-flexible";
// @ts-ignore NPM module
const rateLimiter = new RateLimiterFlexible.default.RateLimiterMemory({
  keyPrefix: "middleware",
  points: 50,
  duration: 3600,
});

export async function RateLimit(ctx: any, next: any) {
  try {
    const rateLimiterRes = await rateLimiter.consume(ctx.request.ip);
    await next();

    const headers: { [key: string]: string } = {
      "Retry-After": `${rateLimiterRes.msBeforeNext / 1000}`,
      "X-RateLimit-Limit": `${rateLimiter.points}`,
      "X-RateLimit-Remaining": `${rateLimiterRes.remainingPoints}`,
      "X-RateLimit-Reset": `${new Date(Date.now() + rateLimiterRes.msBeforeNext)}`,
    };

    for (const header in headers) {
      ctx.response.headers.set(header, headers[header]);
    }
  } catch (_error) {
    ctx.response.status = 429;
    ctx.response.body = "Too Many Requests";
  }
}
