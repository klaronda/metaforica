import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Play, Headphones, Mic, Calendar, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { fetchPodcastEpisodes, type PodcastEpisode } from "../lib/supabase";

const fallbackHeroEpisode: PodcastEpisode = {
  id: "hero-fallback",
  spotify_id: "fallback",
  title: "Metafórica Ep. 110 - Nuevas prácticas con Hesen",
  description:
    "Exploramos cómo incorporar prácticas que liberan el juicio, al tiempo que conectamos con nuestra curiosidad y ligereza interior.",
  publish_date: "2025-11-19T00:00:00Z",
  duration: "1:27:48",
  spotify_url: "https://open.spotify.com/episode/0gC3vpRw7USZCJ9kHPrl5N",
  thumbnail_url:
    "https://images.unsplash.com/photo-1639986162505-c9bcccfc9712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvZGNhc3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjgwMDMzMHww&ixlib=rb-4.1.0&q=80&w=1080",
  youtube_url: "https://www.youtube.com/@metaforicapodcast",
  spotify_embed_url:
    "https://open.spotify.com/embed/episode/3ybYzJZSLlY6E2yU76ni9E/video?utm_source=generator",
  custom_show_notes: "",
  is_featured: true,
  is_visible: true,
  transcript_url: "",
  seo_description: "",
  seo_keywords: "",
  episode_number: 110,
  season: 1,
  created_at: "2025-11-19T00:00:00Z",
  updated_at: "2025-11-19T00:00:00Z"
};

const heroImageUrl =
  "https://fdfchoshzouwguvxfnuv.supabase.co/storage/v1/object/public/site-assets/hero-image.png";

export function Hero() {
  const [latestEpisode, setLatestEpisode] = useState<PodcastEpisode | null>(null);

  useEffect(() => {
    let active = true;
    fetchPodcastEpisodes()
      .then((episodes) => {
        if (!active) return;
        if (episodes.length) {
          setLatestEpisode(episodes[0]);
        }
      })
      .catch((error) => {
        console.error("Failed to load latest episode:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const heroEpisode = latestEpisode ?? fallbackHeroEpisode;
  const heroSpotifyLink = heroEpisode.spotify_url || fallbackHeroEpisode.spotify_url;
  const heroDescription = useMemo(() => {
    const raw = heroEpisode.description ?? fallbackHeroEpisode.description;
    return raw.length > 160 ? `${raw.slice(0, 157)}…` : raw;
  }, [heroEpisode]);
  const heroEmbedUrl = useMemo(() => {
    if (heroEpisode.spotify_embed_url) return heroEpisode.spotify_embed_url;
    if (heroEpisode.spotify_id) {
      return `https://open.spotify.com/embed/episode/${heroEpisode.spotify_id}`;
    }

    const showId = heroEpisode.spotify_url?.split("/").slice(-1)[0];

    if (showId) {
      return `https://open.spotify.com/embed/show/${showId}`;
    }

    return fallbackHeroEpisode.spotify_embed_url!;
  }, [heroEpisode]);
  const heroDateLabel = useMemo(() => {
    if (!heroEpisode.publish_date) return "Fecha próxima";
    try {
      return new Date(heroEpisode.publish_date).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return heroEpisode.publish_date;
    }
  }, [heroEpisode.publish_date]);
  const heroEpisodeNumberLabel = heroEpisode.episode_number
    ? `EP. ${heroEpisode.episode_number}`
    : "EP. Nuevo";
  return (
    <section className="golden-gradient py-20 lg:py-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-300 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-amber-300 rounded-full opacity-25 blur-lg"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-black rounded-full p-2">
                  <Mic className="h-6 w-6 text-yellow-400" />
                </div>
                <span className="text-black font-bold uppercase tracking-wider text-lg">¡NUEVO!</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-black leading-tight text-shadow-warm transform -rotate-1">
                Metafórica
              </h1>
              <p className="text-xl text-black font-semibold leading-relaxed">
                Conectamos que no ver es sentirse abandonado a placeres, 
                tratando connotaciones positivamente para aprender cómo librarnos del arco juicio.
              </p>
              <p className="text-lg text-gray-800 font-medium">
                Por medio de entrevistas y autorreflexión de nuestra host, vamos identificando 
                ideas en nuestra vida que podrías estar limitando nuestra ligereza y paz.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-gray-100 text-black font-bold border-4 border-black rounded-full px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <a href={heroSpotifyLink} target="_blank" rel="noreferrer">
                  <Headphones className="h-6 w-6 mr-3" />
                  Suscríbete en Spotify
                </a>
              </Button>
            </div>
            <div className="flex justify-between gap-8 text-center mt-6">
              <div>
                <div className="text-4xl font-black text-black">103+</div>
                <div className="text-black font-semibold">Episodios</div>
              </div>
              <div>
                <div className="text-4xl font-black text-black">15K+</div>
                <div className="text-black font-semibold">Oyentes</div>
              </div>
              <div>
                <div className="text-4xl font-black text-black">2</div>
                <div className="text-black font-semibold">Libros</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-organic overflow-hidden shadow-2xl" aria-hidden="true">
              <ImageWithFallback
                src={heroImageUrl}
                alt="Metafórica hero artwork"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="text-black font-black text-2xl transform -rotate-12 text-shadow-warm">
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-black rounded-full opacity-80 flex items-center justify-center">
              <Headphones className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Full-width Último Episodio section */}
        <div className="mt-16">
          <div
            className="bg-[#fcf6c4] border border-black/10 rounded-organic overflow-hidden p-8 shadow-xl transition-transform duration-300 hover:scale-[1.01]"
            style={{ backgroundColor: "#FCF6C4" }}
          >
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.4em] text-gray-600 mb-4">
              <span>Último episodio</span>
              <span className="text-amber-600">{heroEpisodeNumberLabel}</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-black leading-tight">{heroEpisode.title}</h3>
            <p className="text-sm text-gray-700 mt-3 mb-4">{heroDescription}</p>
            <div className="flex flex-wrap gap-6 text-xs font-semibold text-gray-600 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {heroDateLabel}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {heroEpisode.duration ?? "Duración"}
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-black">
              <iframe
                title="Último episodio"
                src={heroEmbedUrl}
                className="w-full block"
                style={{ height: "80px" }}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}