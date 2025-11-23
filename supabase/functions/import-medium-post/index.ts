import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MediumPostData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publish_date: string;
  tags: string[];
  featured_image_url?: string;
  read_time?: number;
  canonical_url: string;
}

const fetchMediumPost = async (url: string): Promise<MediumPostData> => {
  // Fetch the Medium post HTML
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Medium post: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  if (!doc) {
    throw new Error("Failed to parse HTML");
  }

  // Extract title
  const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                doc.querySelector('title')?.textContent ||
                'Untitled Post';

  // Extract description/excerpt
  const excerpt = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                  doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                  '';

  // Extract featured image
  const featured_image_url = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || undefined;

  // Extract author
  const author = doc.querySelector('meta[property="article:author"]')?.getAttribute('content') ||
                 doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
                 'Alexandra';

  // Extract publish date
  const publishDateMeta = doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content');
  const publish_date = publishDateMeta ? new Date(publishDateMeta).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  // Extract tags (Medium uses article:tag meta tags)
  const tagElements = doc.querySelectorAll('meta[property="article:tag"]');
  const tags: string[] = [];
  tagElements.forEach((el) => {
    const tag = el.getAttribute('content');
    if (tag) tags.push(tag);
  });

  // Extract read time
  const readTimeText = doc.querySelector('[data-testid="storyReadTime"]')?.textContent || '';
  const readTimeMatch = readTimeText.match(/(\d+)\s*min/);
  const read_time = readTimeMatch ? parseInt(readTimeMatch[1]) : undefined;

  // Extract main content
  // Medium posts are in <article> tags
  const articleElement = doc.querySelector('article');
  let content = '';

  if (articleElement) {
    // Get all paragraphs, headings, lists, etc.
    const contentElements = articleElement.querySelectorAll('p, h1, h2, h3, h4, ul, ol, blockquote, pre, figure');
    
    contentElements.forEach((el) => {
      const tagName = el.tagName.toLowerCase();
      const text = el.textContent?.trim() || '';
      
      if (!text) return;

      switch (tagName) {
        case 'h1':
          content += `<h1>${text}</h1>\n`;
          break;
        case 'h2':
          content += `<h2>${text}</h2>\n`;
          break;
        case 'h3':
          content += `<h3>${text}</h3>\n`;
          break;
        case 'h4':
          content += `<h4>${text}</h4>\n`;
          break;
        case 'blockquote':
          content += `<blockquote>${text}</blockquote>\n`;
          break;
        case 'pre':
          content += `<pre><code>${text}</code></pre>\n`;
          break;
        case 'ul':
          const ulItems = el.querySelectorAll('li');
          content += '<ul>\n';
          ulItems.forEach(li => {
            content += `  <li>${li.textContent?.trim()}</li>\n`;
          });
          content += '</ul>\n';
          break;
        case 'ol':
          const olItems = el.querySelectorAll('li');
          content += '<ol>\n';
          olItems.forEach(li => {
            content += `  <li>${li.textContent?.trim()}</li>\n`;
          });
          content += '</ol>\n';
          break;
        case 'figure':
          // Try to extract image from figure
          const img = el.querySelector('img');
          if (img) {
            const imgSrc = img.getAttribute('src');
            const imgAlt = img.getAttribute('alt') || '';
            if (imgSrc) {
              content += `<figure><img src="${imgSrc}" alt="${imgAlt}" /></figure>\n`;
            }
          } else {
            content += `<p>${text}</p>\n`;
          }
          break;
        case 'p':
        default:
          // Check if paragraph contains links
          const links = el.querySelectorAll('a');
          if (links.length > 0) {
            let pContent = el.innerHTML || text;
            content += `<p>${pContent}</p>\n`;
          } else {
            content += `<p>${text}</p>\n`;
          }
          break;
      }
    });
  }

  // If content extraction failed, use excerpt as fallback
  if (!content || content.trim().length < 100) {
    content = `<p>${excerpt}</p>`;
  }

  return {
    title: title.trim(),
    content: content.trim(),
    excerpt: excerpt.trim().substring(0, 300), // Limit excerpt to 300 chars
    author: author.trim(),
    publish_date,
    tags,
    featured_image_url,
    read_time,
    canonical_url: url,
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  try {
    const { url } = await req.json();

    if (!url || !url.includes('medium.com')) {
      return new Response(
        JSON.stringify({ error: 'Invalid Medium URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Importing Medium post from: ${url}`);

    // Fetch and parse the Medium post
    const postData = await fetchMediumPost(url);

    console.log(`Extracted post: ${postData.title}`);

    // Insert into blog_posts table as external link (not full content)
    const { data, error} = await supabase
      .from('blog_posts')
      .insert({
        title: postData.title,
        content: `<p><a href="${postData.canonical_url}" target="_blank" rel="noopener noreferrer">Leer en Medium.com</a></p>`, // Link to Medium
        excerpt: postData.excerpt,
        seo_description: postData.canonical_url, // Store Medium URL here for easy access
        publish_date: postData.publish_date,
        tags: postData.tags || [],
        featured_image_url: postData.featured_image_url,
        read_time: postData.read_time,
        status: 'published',
        category: 'De Medium.com', // Tag as "De Medium.com"
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log(`Successfully imported post: ${data.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        post: data,
        message: `Successfully imported: ${postData.title}` 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Medium import failed:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        details: error.stack 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

