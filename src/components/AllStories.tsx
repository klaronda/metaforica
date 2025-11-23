import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { BookOpen, Heart, MessageCircle, FileText, CheckCircle, Search, ExternalLink, X } from "lucide-react";
import { fetchWattpadStories, type WattpadStory } from "../lib/supabase";

export function AllStories() {
  const [stories, setStories] = useState<WattpadStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<WattpadStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await fetchWattpadStories(true);
        setStories(data);
        setFilteredStories(data);
      } catch (error) {
        console.error("Failed to load stories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStories(stories);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStories(
        stories.filter(
          (story) =>
            story.title.toLowerCase().includes(query) ||
            story.description.toLowerCase().includes(query) ||
            story.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, stories]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-100 to-pink-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge className="bg-purple-600 text-white uppercase tracking-[0.5em] px-4 py-1 text-xs">
                Historias
              </Badge>
              <h1 className="text-5xl md:text-6xl font-black text-black text-shadow-warm">
                Cuentos y Narrativas
              </h1>
              <p className="text-xl md:text-2xl text-gray-800 font-semibold max-w-3xl mx-auto leading-relaxed">
                Una colección de historias personales, reflexiones y narrativas que exploran la vida
                desde diferentes ángulos y perspectivas.
              </p>

              {/* Stats */}
              {!isLoading && (
                <div className="flex justify-center gap-8 mt-8">
                  <div>
                    <div className="text-3xl font-black text-purple-600">{stories.length}</div>
                    <div className="text-sm text-gray-600">Historias</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-purple-600">
                      {formatNumber(stories.reduce((sum, s) => sum + s.read_count, 0))}
                    </div>
                    <div className="text-sm text-gray-600">Lecturas</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-purple-600">
                      {stories.filter((s) => s.is_completed).length}
                    </div>
                    <div className="text-sm text-gray-600">Completas</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-organic border-2 border-purple-200 p-6 shadow-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Buscar historias, tags, temas..."
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
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Cargando historias...</p>
              </div>
            ) : filteredStories.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No se encontraron historias</h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "Intenta con otra búsqueda"
                    : "Las historias aparecerán aquí cuando estén disponibles"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStories.map((story) => (
                  <Card
                    key={story.id}
                    className="rounded-organic border-2 border-purple-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    onClick={() => window.open(story.story_url, "_blank")}
                  >
                    <div className="relative">
                      <img
                        src={story.cover_image_url}
                        alt={story.title}
                        className="w-full h-64 object-cover"
                      />
                      {story.is_featured && (
                        <Badge className="absolute top-3 left-3 bg-yellow-500">Destacado</Badge>
                      )}
                      {story.is_completed && (
                        <Badge className="absolute top-3 right-3 bg-green-500 gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Completo
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6 space-y-3">
                      <h3 className="text-lg font-black text-black leading-tight line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                        {story.description}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600 font-semibold">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {formatNumber(story.read_count)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {formatNumber(story.vote_count)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {formatNumber(story.comment_count)}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {story.part_count}
                        </div>
                      </div>

                      {/* Tags */}
                      {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {story.tags.slice(0, 4).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Read Button */}
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(story.story_url, "_blank");
                        }}
                      >
                        Leer en Wattpad
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {!isLoading && filteredStories.length > 0 && (
          <section className="py-16 bg-gradient-to-br from-purple-100 to-pink-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-black text-shadow-warm">
                ¿Te Gustaron las Historias?
              </h2>
              <p className="text-lg text-gray-800 font-semibold">
                Sígueme en Wattpad para recibir notificaciones cuando publique nuevas historias y capítulos.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <a
                  href="https://www.wattpad.com/user/SoyMetaforica"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Seguir en Wattpad
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

