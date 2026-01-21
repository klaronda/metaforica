import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseClient = supabase; // Alias for backward compatibility

// TypeScript interfaces
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  publish_date?: string;
  is_published?: boolean;
  tags?: string[];
  category?: string;
  slug?: string;
  featured_image_url?: string;
  featured_image_path?: string;
  read_time?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PodcastEpisode {
  id: string;
  spotify_id?: string;
  title: string;
  description: string;
  publish_date?: string;
  duration?: string;
  spotify_url?: string;
  spotify_embed_url?: string;
  thumbnail_url?: string;
  youtube_url?: string;
  custom_show_notes?: string;
  is_featured?: boolean;
  is_visible?: boolean;
  transcript_url?: string;
  seo_description?: string;
  seo_keywords?: string;
  episode_number?: number;
  season?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AboutPageContent {
  id: string;
  section_type: string;
  content: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface WattpadStory {
  id: string;
  wattpad_id: string;
  title: string;
  description: string;
  cover_image_url: string;
  story_url: string;
  tags: string[];
  read_count: number;
  vote_count: number;
  comment_count: number;
  part_count: number;
  language: string;
  is_completed: boolean;
  is_visible: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  last_synced_at?: string;
}

// Fetch podcast episodes
export async function fetchPodcastEpisodes(): Promise<PodcastEpisode[]> {
  const { data, error } = await supabaseClient
    .from("podcast_episodes")
    .select("*")
    .eq("is_visible", true)
    .order("publish_date", { ascending: false });

  if (error) {
    console.error("Failed to load podcast episodes:", error);
    throw error;
  }

  return data || [];
}

// Fetch blog posts
export async function fetchBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  let query = supabaseClient.from("blog_posts").select("*");

  if (publishedOnly) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query.order("publish_date", { ascending: false });

  if (error) {
    console.error("Failed to load blog posts:", error);
    throw error;
  }

  return data || [];
}

// Fetch Wattpad stories
export async function fetchWattpadStories(visibleOnly = true): Promise<WattpadStory[]> {
  let query = supabaseClient.from("wattpad_stories").select("*");

  if (visibleOnly) {
    query = query.eq("is_visible", true);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load Wattpad stories:", error);
    throw error;
  }

  return data || [];
}
