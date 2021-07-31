import * as RateLimiterFlexible from "https://dev.jspm.io/rate-limiter-flexible";
// @ts-ignore NPM module
const rateLimiter = new RateLimiterFlexible.default.RateLimiterMemory({
  keyPrefix: "middleware",
  points: 50,
  duration: 3600,
});

export async function RateLimit(ctx: any, next: any) {
  try {
    await rateLimiter.consume(ctx.request.ip);
    await next();
  } catch (_error) {
    ctx.response.status = 429;
    ctx.response.body = "Too Many Requests";
  }
}
