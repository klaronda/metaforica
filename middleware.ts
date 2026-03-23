import { next, rewrite } from '@vercel/functions';

const CRAWLER_UA_PATTERNS = [
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'slackbot',
  'telegrambot',
  'pinterest',
  'discordbot',
  'googlebot',
];

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_UA_PATTERNS.some((pattern) => ua.includes(pattern));
}

/**
 * Match /escritos/:slug (exactly one path segment after /escritos/).
 * Does not match /escritos or /escritos/ or /escritos/a/b.
 */
function getEscritosSlug(pathname: string): string | null {
  const match = pathname.match(/^\/escritos\/([^/]+)$/);
  return match ? match[1] : null;
}

export default function middleware(request: Request): Response {
  const url = new URL(request.url);
  const slug = getEscritosSlug(url.pathname);
  const ua = request.headers.get('user-agent');

  if (slug && isCrawler(ua)) {
    const ogUrl = new URL(`/api/og-post?slug=${encodeURIComponent(slug)}`, url.origin);
    return rewrite(ogUrl);
  }

  return next();
}
