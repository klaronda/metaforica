import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const WATTPAD_USERNAME = "SoyMetaforica";
const WATTPAD_API_BASE = "https://www.wattpad.com/api/v3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WattpadStory {
  id: string;
  title: string;
  description: string;
  cover: string;
  url: string;
  tags: string[];
  readCount: number;
  voteCount: number;
  commentCount: number;
  numParts: number;
  language: { name: string };
  completed: boolean;
  createDate: string;
  modifyDate: string;
}

const fetchWattpadStories = async (): Promise<WattpadStory[]> => {
  try {
    // Fetch user's stories
    const response = await fetch(
      `${WATTPAD_API_BASE}/users/${WATTPAD_USERNAME}/stories?limit=50`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Wattpad API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.stories || !Array.isArray(data.stories)) {
      console.log("Wattpad response:", JSON.stringify(data));
      throw new Error("Invalid response format from Wattpad API");
    }

    return data.stories;
  } catch (error) {
    console.error("Error fetching from Wattpad:", error);
    throw error;
  }
};

const mapWattpadStory = (story: WattpadStory) => {
  return {
    wattpad_id: story.id.toString(),
    title: story.title,
    description: story.description || '',
    cover_image_url: story.cover,
    story_url: story.url || `https://www.wattpad.com/story/${story.id}`,
    tags: story.tags || [],
    read_count: story.readCount || 0,
    vote_count: story.voteCount || 0,
    comment_count: story.commentCount || 0,
    part_count: story.numParts || 0,
    language: story.language?.name || 'es',
    is_completed: story.completed || false,
    is_visible: true,
    updated_at: new Date().toISOString(),
    last_synced_at: new Date().toISOString(),
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
    console.log(`Fetching stories for Wattpad user: ${WATTPAD_USERNAME}`);
    
    const stories = await fetchWattpadStories();
    
    console.log(`Found ${stories.length} stories from Wattpad`);

    if (!stories.length) {
      return new Response(
        JSON.stringify({ synced: 0, note: "No stories found" }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map Wattpad data to our schema
    const payload = stories
      .filter(Boolean)
      .map(mapWattpadStory)
      .filter(Boolean);

    console.log(`Upserting ${payload.length} stories to database`);

    // Upsert to Supabase
    const { error } = await supabase
      .from('wattpad_stories')
      .upsert(payload, { onConflict: 'wattpad_id' });

    if (error) {
      console.error("Database upsert error:", error);
      throw error;
    }

    console.log(`Successfully synced ${payload.length} stories`);

    return new Response(
      JSON.stringify({ synced: payload.length, stories: payload.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Wattpad sync failed:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

