import { useState, useMemo, useEffect } from "react";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, X, Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase, type BlogPost as SupabaseBlogPost } from "../lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  publishDate: string;
  readTime: number;
  slug?: string;
  featuredImage?: string;
  seoDescription?: string;
}

const categories = ['Todos', 'Consejos de Escritura', 'Proceso de Escritura', 'Análisis Literario', 'Desarrollo Personal', 'Técnicas de Escritura'];
const fallbackImages = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYU1lYWxtfHx3cml0aW5nJTIwaG9scyUyMHBob3RvfGVufDF8fHx8MTc2Mjc5OTYzOXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjB3cml0aW5nJTIwbG9uZXxlbnwxfHx8fDE3NjI3OTk2MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWV8ZW58MXx8fHwxNzYyNzk5NjM3fDA&ixlib=rb-4.1.0&q=80&w=1080"
];

const mapDbPostToBlogPost = (row: SupabaseBlogPost): BlogPost => ({
  id: row.id,
  title: row.title || 'Untitled',
  content: row.content || '',
  excerpt: row.excerpt || '',
  tags: row.tags || [],
  category: row.category || '',
  status: row.status === 'published' ? 'published' : 'draft',
  publishDate: row.publish_date || new Date().toISOString(),
  readTime: row.read_time ?? 0,
  slug: row.slug || '',
  featuredImage: row.featured_image_url || undefined,
  seoDescription: row.seo_description || undefined
});

interface AllBlogPostsProps {
  onReadPost: (slug: string) => void;
}

export function AllBlogPosts({ onReadPost }: AllBlogPostsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('newest');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false });

      if (error) throw error;
      setPosts(((data ?? []) as SupabaseBlogPost[]).map(mapDbPostToBlogPost));
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const filteredAndSortedPosts = useMemo(() => {
    const sourcePosts = posts;
    let filtered = sourcePosts.filter(post => post.status === 'published');

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'readTime':
          return a.readTime - b.readTime;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-black text-shadow-warm mb-4">
            Nuestro Blog
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 font-semibold max-w-3xl mx-auto leading-relaxed">
            Un espacio de reflexiones cotidianas, preguntas con muchas posibles respuestas y a veces escritos un tanto poéticos (sí, acá nos gusta romantizar muchas cosas).
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-organic border-2 border-primary/20 p-6 mb-8 shadow-lg">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en todos los escritos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="oldest">Más antiguos</SelectItem>
                <SelectItem value="readTime">Tiempo de lectura</SelectItem>
                <SelectItem value="title">Título (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results summary */}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Mostrando {filteredAndSortedPosts.length} escritos
            </span>
            {(searchQuery || selectedCategory !== 'Todos') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                }}
                className="text-xs"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedPosts.map((post, index) => {
                  // Medium posts: wrap in <a> with target="_blank"
                  const isMediumPost = post.seoDescription?.startsWith('http');
                  
                  const cardContent = (
            <Card
              key={post.id}
              className="rounded-organic border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl group bg-white cursor-pointer overflow-hidden"
              onClick={isMediumPost ? undefined : () => onReadPost(post.slug || post.id)}
            >
              <div className="h-48 w-full overflow-hidden">
                <ImageWithFallback
                  src={post.featuredImage || fallbackImages[index % fallbackImages.length]}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readTime} min
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
                <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publishDate)}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs bg-muted px-2 py-1 rounded-md flex items-center gap-1"
                    >
                      <Tag className="h-2 w-2" />
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{post.tags.length - 3} más
                    </span>
                  )}
                </div>

                {/* Read More Button */}
                {isMediumPost ? (
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    asChild
                  >
                    <span className="flex items-center justify-center">
                      Leer en Medium
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    onClick={(event) => {
                      event.stopPropagation();
                      onReadPost(post.slug || post.id);
                    }}
                  >
                    Leer más
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </CardContent>
            </Card>
                  );

                  // Return wrapped in <a> for Medium posts, unwrapped for regular posts
                  return isMediumPost ? (
                    <a 
                      key={post.id}
                      href={post.seoDescription} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {cardContent}
                    </a>
                  ) : cardContent;
                })}
        </div>

        {/* No results */}
        {filteredAndSortedPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-organic border-2 border-border p-8 max-w-md mx-auto">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">No se encontraron escritos</h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar tus filtros de búsqueda o explora diferentes categorías.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                }}
                variant="outline"
              >
                Ver todos los escritos
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}