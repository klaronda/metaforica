import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase, type BlogPost as SupabaseBlogPost } from "../lib/supabase";

interface BlogSectionProps {
  onReadMore: (slug: string) => void;
  onViewAll?: () => void;
}

interface BlogEntry {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  slug?: string;
  featuredImage?: string;
}

const mapRowToEntry = (row: SupabaseBlogPost): BlogEntry => ({
  id: row.id,
  title: row.title || "Untitled",
  excerpt: row.excerpt || "",
  category: row.category || "General",
  date: row.publish_date || "",
  readTime: row.read_time ?? 0,
  slug: row.slug || '',
  featuredImage: row.featured_image_url || undefined
});

const formatDate = (dateValue: string) => {
  if (!dateValue) return "";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

export function BlogSection({ onReadMore, onViewAll }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("status", "published")
          .order("publish_date", { ascending: false })
          .limit(3);

        if (error) throw error;
        const mappedPosts = ((data ?? []) as SupabaseBlogPost[]).map(mapRowToEntry);
        // ALWAYS limit to exactly 3 posts for homepage
        setPosts(mappedPosts.slice(0, 3));
      } catch (error) {
        console.error("Failed to load blog section posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-yellow-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-lg text-muted-foreground">Cargando escritos...</p>
        </div>
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-yellow-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-lg text-muted-foreground">
            No hay escritos publicados todavía.
          </p>
        </div>
      </section>
    );
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 3);

  return (
    <section id="blog" className="py-16 lg:py-24 bg-gradient-to-br from-yellow-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black text-shadow-warm transform -rotate-1">
            Nuestro Blog
          </h2>
          <p className="text-xl text-gray-800 font-semibold max-w-3xl mx-auto">
            Un espacio de reflexiones cotidianas, preguntas con muchas posibles respuestas y a veces escritos un tanto poéticos (sí, acá nos gusta romantizar muchas cosas).
          </p>
        </div>

        {/* Featured post */}
        <div className="mb-12">
          <Card
            className="overflow-hidden border-4 border-black shadow-2xl rounded-organic transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{ backgroundColor: 'transparent' }}
            onClick={async () => {
              // If it's a Medium post, open in new tab
              if (featuredPost.category === 'De Medium.com') {
                // Fetch the full post to get the Medium URL from seo_description
                const { data } = await supabase.from('blog_posts').select('seo_description').eq('id', featuredPost.id).single();
                if (data?.seo_description?.startsWith('http')) {
                  window.open(data.seo_description, '_blank');
                } else {
                  onReadMore(featuredPost.slug || featuredPost.id);
                }
              } else {
                onReadMore(featuredPost.slug || featuredPost.id);
              }
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <ImageWithFallback
                  src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1612907527100-f02bb2b26b1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwam91cm5hbCUyMHBlbnxlbnwxfHx8fDE3NTUyNzk2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                  alt="Featured blog post"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center !bg-[#fdd91f]" style={{ backgroundColor: '#fdd91f' }}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-black !text-[#fdd91f] font-bold px-3 py-1 rounded-full" style={{ color: '#fdd91f' }}>
                      ¡DESTACADO!
                    </Badge>
                    <Badge className="bg-white text-black font-bold border-2 border-black">{featuredPost.category}</Badge>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black text-black leading-tight text-shadow-warm">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-800 text-lg leading-relaxed font-semibold">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-black font-semibold">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(featuredPost.date)}</span>
                    </div>
                    <span>•</span>
                    <span>{featuredPost.readTime} lectura</span>
                  </div>
                  <Button 
                    onClick={() => onReadMore(featuredPost.slug || featuredPost.id)}
                    className="bg-black hover:bg-gray-800 !text-[#fdd91f] font-bold rounded-full px-6 py-3 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    style={{ color: '#fdd91f' }}
                  >
                    Leer Completo
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Recent posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {recentPosts.map((post, index) => {
            const images = [
              "https://images.unsplash.com/photo-1753351055373-184ff64971d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXN0ZW5pbmclMjBjb252ZXJzYXRpb24lMjBjb21tdW5pY2F0aW9ufGVufDF8fHx8MTc2Mjc5OTYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              "https://images.unsplash.com/photo-1724445044107-61074c27d7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGdyb3d0aCUyMGpvdXJuZXl8ZW58MXx8fHwxNzYyNzIzODc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            ];
            return (
              <Card 
                key={post.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-black bg-white rounded-organic hover:scale-105 transform"
                onClick={async () => {
                  // If it's a Medium post, open in new tab
                  if (post.category === 'De Medium.com') {
                    const { data } = await supabase.from('blog_posts').select('seo_description').eq('id', post.id).single();
                    if (data?.seo_description?.startsWith('http')) {
                      window.open(data.seo_description, '_blank');
                    } else {
                      onReadMore(post.slug || post.id);
                    }
                  } else {
                    onReadMore(post.slug || post.id);
                  }
                }}
              >
                <div className="h-48 relative">
                  <ImageWithFallback
                    src={post.featuredImage || images[index % images.length]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-black text-yellow-400 font-bold">{post.category}</Badge>
                  </div>
                  <h3 className="text-xl font-black text-black leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 font-semibold">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-black font-semibold pb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <span>{post.readTime} lectura</span>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* View all button */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={onViewAll}
            className="bg-black hover:bg-gray-800 text-yellow-400 font-bold rounded-full px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Ver Todos los Escritos
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}