import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, Clock, Tag, ArrowLeft, Share2, Eye } from "lucide-react";
import { supabase, type BlogPost as SupabaseBlogPost } from "../lib/supabase";
import { ShareModal } from "./ShareModal";

interface BlogPostProps {
  slug: string | null;
  onBack: () => void;
}

const formatPublishDate = (value?: string) => {
  if (!value) return "Fecha pendiente";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

const formatTimestamp = (value?: string) => {
  if (!value) return "Sin fecha";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

export function BlogPost({ slug, onBack }: BlogPostProps) {
  const [post, setPost] = useState<SupabaseBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    // Scroll to top when slug changes
    window.scrollTo({ top: 0, behavior: "instant" });
    
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (!supabase) {
      setError("No hay conexión con la base de datos.");
      setLoading(false);
      return;
    }

    // Try to fetch by slug first, fall back to ID if slug column doesn't exist
    // Try to fetch by slug first, fall back to ID if slug column doesn't exist
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        // If slug column doesn't exist (error code 42703) or post not found, try using slug as ID (backward compatibility)
        if (error && (error.code === '42703' || error.message?.includes('does not exist'))) {
          console.warn("Slug column not found, falling back to ID lookup:", error);
          // Fall back to treating slug as ID for backward compatibility
          return supabase
            .from("blog_posts")
            .select("*")
            .eq("id", slug)
            .single()
            .then(({ data: fallbackData, error: fallbackError }) => {
              if (fallbackError) {
                setError("No se encontró este escrito.");
                console.error("Failed to load blog post:", fallbackError);
                setLoading(false);
              } else {
                // Debug logging
                console.log("Blog post data (fallback):", fallbackData);
                console.log("Content value:", fallbackData?.content);
                console.log("Content length:", fallbackData?.content?.length);
                console.log("Content trimmed length:", fallbackData?.content?.trim()?.length);
                
                // If it's a Medium post, open in new tab
                if (fallbackData && fallbackData.category === 'De Medium.com' && fallbackData.seo_description?.startsWith('http')) {
                  window.open(fallbackData.seo_description, '_blank');
                  setLoading(false);
                  return;
                }
                setPost(fallbackData as SupabaseBlogPost);
                setLoading(false);
              }
            });
        }
        
        if (error) {
          setError("No se encontró este escrito.");
          console.error("Failed to load blog post:", error);
          setLoading(false);
        } else {
          // Debug logging
          console.log("Blog post data:", data);
          console.log("Content value:", data?.content);
          console.log("Content length:", data?.content?.length);
          console.log("Content trimmed length:", data?.content?.trim()?.length);
          
          // If it's a Medium post, open in new tab
          if (data && data.category === 'De Medium.com' && data.seo_description?.startsWith('http')) {
            window.open(data.seo_description, '_blank');
            setLoading(false);
            return;
          }
          setPost(data as SupabaseBlogPost);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Unexpected error loading blog post:", err);
        setError("Error al cargar el escrito.");
        setLoading(false);
      });
  }, [slug]);

  const contentHtml = post?.content && post.content.trim().length > 0
    ? post.content
    : post?.excerpt && post.excerpt.trim().length > 0
      ? `<p>${post.excerpt}</p>`
      : "<p>El contenido aún no está disponible.</p>";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando escrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Selecciona un escrito para leerlo.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      <div className="bg-white border-b border-primary/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Blog
          </Button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-6">
          <div className="flex flex-wrap gap-2 items-center">
            {post.category && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                {post.category}
              </Badge>
            )}
            <Badge variant="outline">{post.status === "published" ? "Publicado" : "Borrador"}</Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight text-shadow-warm">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatPublishDate(post.publish_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.read_time ?? 0} min de lectura</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{formatTimestamp(post.updated_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </header>

        {post.featured_image_url && (
          <div className="rounded-organic overflow-hidden shadow-xl">
            <ImageWithFallback
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div
            className="rich-text-content bg-white rounded-organic border-2 border-primary/20 p-8 shadow-lg"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
            style={{ minHeight: '200px' }}
          />
        </div>

        <div>
          <h3 className="text-lg mb-4">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            {(post.tags || []).map((tag) => (
              <span 
                key={tag} 
                className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-accent transition-colors cursor-pointer"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      <ShareModal
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        title={post.title}
        url={window.location.href}
        excerpt={post.excerpt}
        imageUrl={post.featured_image_url}
      />
    </div>
  );
}