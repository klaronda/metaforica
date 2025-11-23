import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { BookOpen, Heart, MessageCircle, ExternalLink, FileText, CheckCircle } from "lucide-react";
import { fetchWattpadStories, type WattpadStory } from "../lib/supabase";

export function StoriesSection() {
  const [stories, setStories] = useState<WattpadStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await fetchWattpadStories(true);
        // Get top 4 stories by read count
        setStories(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load stories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return null; // Don't show section while loading
  }

  if (stories.length === 0) {
    return null; // Don't show section if no stories
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center gap-3">
            <Badge className="bg-purple-600 text-white uppercase tracking-[0.5em] px-4 py-1 text-xs">
              Historias
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black text-shadow-warm">
            Cuentos y Narrativas
          </h2>
          <p className="text-lg md:text-xl text-gray-800 font-semibold max-w-3xl mx-auto leading-relaxed">
            Historias personales, reflexiones y narrativas que exploran la vida desde diferentes ángulos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="rounded-organic border-2 border-purple-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => window.open(story.story_url, '_blank')}
            >
              <div className="relative">
                <img
                  src={story.cover_image_url}
                  alt={story.title}
                  className="w-full h-64 object-cover"
                />
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
                    <FileText className="h-3 w-3" />
                    {story.part_count} partes
                  </div>
                </div>

                {/* Tags */}
                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {story.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
            onClick={() => window.location.href = '/historias'}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Ver Todas las Historias
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

