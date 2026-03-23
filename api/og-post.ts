import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://soymetaforica.com';
const DEFAULT_IMAGE = 'https://fdfchoshzouwguvxfnuv.supabase.co/storage/v1/object/public/site-assets/hero-image.png';
const DEFAULT_DESCRIPTION = 'Explora la condición humana a través de historias, reflexiones y conversaciones profundas.';

type BlogPostRow = {
  id?: string | null;
  title?: string | null;
  slug?: string | null;
  status?: string | null;
  featured_image_url?: string | null;
  excerpt?: string | null;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function buildOgHtml(params: {
  title: string;
  description: string;
  image: string;
  url: string;
  imageWidth?: string;
  imageHeight?: string;
}): string {
  const title = escapeHtml(params.title);
  const description = escapeHtml(params.description);
  const image = escapeHtml(params.image);
  const url = escapeHtml(params.url);
  const w = params.imageWidth ?? '1200';
  const h = params.imageHeight ?? '630';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="${w}">
  <meta property="og:image:height" content="${h}">
  <meta property="og:site_name" content="Metafórica">
  <meta property="og:locale" content="es_ES">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
  <p><a href="${url}">Abrir artículo en Metafórica</a></p>
</body>
</html>`;
}

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let identifier: string | null =
    typeof req.query?.slug === 'string' ? req.query.slug.trim() : null;
  if (!identifier && req.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      identifier = url.searchParams.get('slug')?.trim() ?? null;
    } catch {
      identifier = null;
    }
  }
  if (!identifier) {
    res.status(302);
    res.setHeader('Location', `${SITE_URL}/escritos`);
    res.end();
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).end(
      buildOgHtml({
        title: 'Metafórica',
        description: DEFAULT_DESCRIPTION,
        image: DEFAULT_IMAGE,
        url: SITE_URL,
      })
    );
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  let row: BlogPostRow | null = null;

  // 1) Primary path for future posts: direct slug lookup.
  const slugLookup = await supabase
    .from('blog_posts')
    .select('id, title, slug, status, featured_image_url, excerpt')
    .eq('slug', identifier)
    .maybeSingle();

  if (slugLookup.data) {
    row = slugLookup.data as BlogPostRow;
  } else {
    // 2) Backward compatibility for older URLs that may contain an ID.
    const idLookup = await supabase
      .from('blog_posts')
      .select('id, title, slug, status, featured_image_url, excerpt')
      .eq('id', identifier)
      .maybeSingle();
    if (idLookup.data) {
      row = idLookup.data as BlogPostRow;
    }
  }

  // 3) Legacy fallback: some existing posts can have no slug stored.
  //    Resolve by comparing incoming slug with a normalized slug from title.
  if (!row) {
    const allPublished = await supabase
      .from('blog_posts')
      .select('id, title, slug, status, featured_image_url, excerpt');

    if (allPublished.data?.length) {
      const wanted = normalizeSlug(identifier);
      row =
        ((allPublished.data as BlogPostRow[]).find((post) => {
          const candidate = (post.slug && post.slug.trim()) || normalizeSlug(post.title || '');
          return candidate === wanted;
        }) as BlogPostRow | undefined) ?? null;
    }
  }

  // Only return OG cards for publishable posts (published or legacy null status).
  const status = (row?.status || '').toLowerCase();
  const isPublishable = !row || status === 'published' || status === '';

  if (!row || !isPublishable) {
    res.status(302);
    res.setHeader('Location', `${SITE_URL}/escritos`);
    res.end();
    return;
  }

  const title = `${row.title ?? 'Escrito'} por Metafórica`;
  const description = (row.excerpt && String(row.excerpt).trim()) || DEFAULT_DESCRIPTION;
  const image = (row.featured_image_url && String(row.featured_image_url).trim()) || DEFAULT_IMAGE;
  const canonicalSlug = (row.slug && row.slug.trim()) || normalizeSlug(row.title || '') || identifier;
  const url = `${SITE_URL}/escritos/${encodeURIComponent(canonicalSlug)}`;

  const html = buildOgHtml({
    title,
    description,
    image,
    url,
  });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.status(200).end(html);
}
