import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SHOW_ID = Deno.env.get("SPOTIFY_SHOW_ID")!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const fetchSpotifyToken = async () => {
  const clientId = Deno.env.get("SPOTIFY_CLIENT_ID")!;
  const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET")!;
  const resp = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa(`${clientId}:${clientSecret}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!resp.ok) {
    throw new Error(`Spotify token request failed: ${await resp.text()}`);
  }

  const json = await resp.json();
  return json.access_token as string;
};

const buildEmbedUrl = (spotifyId?: string, spotifyUrl?: string) => {
  if (spotifyId) return `https://open.spotify.com/embed/episode/${spotifyId}`;
  if (spotifyUrl) {
    const segments = spotifyUrl.split("/");
    const id = segments[segments.length - 1]?.split("?")[0];
    if (id) return `https://open.spotify.com/embed/episode/${id}`;
  }
  return undefined;
};

const fetchEpisodes = async (token: string) => {
  const resp = await fetch(`https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?market=US&limit=10`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    throw new Error(`Spotify episodes request failed: ${await resp.text()}`);
  }

  const data = await resp.json();
  return data.items as Array<any>;
};

const formatDuration = (ms?: number) => {
  if (!ms) return null;
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
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
    const token = await fetchSpotifyToken();
    const episodes = await fetchEpisodes(token);

    console.log("Spotify response items:", episodes?.length ?? "none");

    if (!Array.isArray(episodes) || episodes.length === 0) {
      return new Response(
        JSON.stringify({ synced: 0, note: "No episodes returned" }), 
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = episodes
      .filter(Boolean)
      .map((episode) => {
        if (!episode?.id) return null;

        return {
          spotify_id: episode.id,
          title: episode.name,
          description: episode.description,
          publish_date: episode.release_date,
          duration: formatDuration(episode.duration_ms),
          spotify_url: episode.external_urls?.spotify,
          spotify_embed_url: buildEmbedUrl(episode.id, episode.external_urls?.spotify),
          thumbnail_url: episode.images?.[0]?.url ?? null,
          episode_number: episode.episode_number,
          season: episode.season ?? null,
          is_visible: true,
          updated_at: new Date().toISOString(),
        };
      })
      .filter(Boolean);

    if (!payload.length) {
      return new Response(
        JSON.stringify({ synced: 0, note: "No valid episodes" }), 
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { error } = await supabase
      .from("podcast_episodes")
      .upsert(payload, { onConflict: "spotify_id" });

    if (error) throw error;

    return new Response(
      JSON.stringify({ synced: payload.length }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Podcast sync failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


