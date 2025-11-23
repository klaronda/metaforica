import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, Clock, Tag, ArrowLeft, Share2, Heart, Bookmark, Eye } from "lucide-react";
import { supabase, type BlogPost as SupabaseBlogPost } from "../lib/supabase";

interface BlogPostProps {
  postId: string | null;
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

export function BlogPost({ postId, onBack }: BlogPostProps) {
  const [post, setPost] = useState<SupabaseBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(142);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    }
  };

  useEffect(() => {
    if (!postId) {
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

    supabase
      .from("blog_posts")
      .select("*")
      .eq("id", postId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError("No se encontró este escrito.");
          console.error("Failed to load blog post:", error);
        } else {
          // If it's a Medium post, open in new tab
          if (data && data.category === 'De Medium.com' && data.seo_description?.startsWith('http')) {
            window.open(data.seo_description, '_blank');
            return;
          }
          setPost(data as SupabaseBlogPost);
        }
      })
      .finally(() => setLoading(false));
  }, [postId]);

  const contentHtml = post?.content?.trim()
    ? post.content
    : post?.excerpt
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
                onClick={handleLike}
                className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'} transition-colors`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-primary'} transition-colors`}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                Guardar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
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
    </div>
  );
}