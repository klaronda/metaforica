import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Calendar, Clock, ExternalLink, Music, Youtube } from "lucide-react";
import { fetchPodcastEpisodes } from "../lib/supabase";

type DisplayEpisode = {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  spotify_url?: string;
  spotify_id?: string;
  spotify_embed_url?: string;
  thumbnail_url?: string;
};

const buildEmbedUrl = (spotifyId?: string, spotifyUrl?: string, compact = false) => {
  const compactParam = compact ? "?theme=0" : "";
  if (spotifyId) return `https://open.spotify.com/embed/episode/${spotifyId}${compactParam}`;
  if (spotifyUrl) {
    const parts = spotifyUrl.split("/");
    const episodeId = parts[parts.length - 1]?.split("?")[0];
    if (episodeId) {
      return `https://open.spotify.com/embed/episode/${episodeId}${compactParam}`;
    }
  }
  return undefined;
};

const normalizeEmbedUrl = (url?: string) => {
  if (!url) return undefined;
  // If URL already has query params, append theme=0, otherwise add it
  if (url.includes('?')) {
    // Check if theme is already set
    if (url.includes('theme=')) {
      return url;
    }
    return `${url}&theme=0`;
  }
  return `${url}?theme=0`;
};

const fallbackDisplayEpisodes: DisplayEpisode[] = [
  {
    id: "placeholder-103",
    title: "Metafórica Ep. 103 - Me gusta y no sé cómo manejarlo",
    description:
      "¿Te has sentido muy enganchado con alguien antes del tiempo? ¿Te ha ganado el entusiasmo y no supiste cómo continuar? Aquí conversamos con Javicho y reímos.",
    date: "6 Ago 2024",
    duration: "1:15:16",
    spotify_embed_url: buildEmbedUrl(undefined, "https://open.spotify.com/episode/0gC3vpRw7USZCJ9kHPrl5N"),
    thumbnail_url: "https://images.unsplash.com/photo-1507537509458-b8312d53c5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkJTIwdGh1bWJefGVufDF8fHx8MTc2MjgzOTE5OXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "placeholder-102",
    title: "Metafórica Ep. 102 - Identidad y propósito",
    description:
      "Exploramos cómo navegar la identidad y propósito mientras nos movemos entre lo digital y lo humano.",
    date: "30 Jul 2024",
    duration: "58:42",
    spotify_embed_url: buildEmbedUrl(undefined, "https://open.spotify.com/episode/1zH1uQDJf8GHV7X3iQh7pf"),
    thumbnail_url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25zJTIwd29ya2luZyUyMGdyb3VwfGVufDF8fHx8MTc2MjgzOTE5OXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "placeholder-101",
    title: "Metafórica Ep. 101 - El miedo al compromiso",
    description:
      "Una reflexión sobre el temor adulto a comprometerse y cómo ese miedo moldea nuestras relaciones.",
    date: "23 Jul 2024",
    duration: "1:02:18",
    spotify_embed_url: buildEmbedUrl(undefined, "https://open.spotify.com/episode/2Q59eSZ0W8json"),
    thumbnail_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHVuZGVyfGVufDF8fHx8MTc2MjgzOTE5OXww&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const truncateWords = (text: string | undefined, limit = 30) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "…";
};

export function PodcastSection() {
  const [episodes, setEpisodes] = useState<DisplayEpisode[]>(fallbackDisplayEpisodes);

  useEffect(() => {
    let active = true;
    fetchPodcastEpisodes()
      .then((data) => {
        if (!active || !data.length) return;
        const mapped = data.map((episode) => ({
          id: episode.id,
          title: episode.title,
          description: episode.description,
          date: new Date(episode.publish_date ?? "").toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }),
          duration: episode.duration ?? "00:00",
          spotify_url: episode.spotify_url,
          spotify_embed_url: buildEmbedUrl(episode.spotify_id, episode.spotify_url),
          thumbnail_url: episode.thumbnail_url
        }));
        if (mapped.length) {
          setEpisodes(mapped);
        }
      })
      .catch((error) => console.error("Failed to load podcast episodes:", error));
    return () => {
      active = false;
    };
  }, []);

  const featuredEpisode = episodes[0];
  const secondaryEpisodes = episodes.slice(1, 5);
  const featuredSpotifyLink =
    featuredEpisode?.spotify_url ?? "https://open.spotify.com/show/0gC3vpRw7USZCJ9kHPrl5N";

  const heroCopy = truncateWords(featuredEpisode?.description, 32);

  const getThumbnail = (episode?: DisplayEpisode) =>
    episode?.thumbnail_url ??
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60";

  return (
    <section id="podcast" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-black text-yellow-400 uppercase tracking-[0.5em] px-4 py-1 text-xs rounded-full font-bold">
              podcast
            </span>
            <span className="bg-white text-black border border-black/20 uppercase tracking-[0.4em] px-4 py-1 text-xs rounded-full font-bold">
              Últimos episodios
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black text-shadow-warm">
            Podcast Metafórica
          </h2>
          <p className="text-lg md:text-xl text-gray-800 font-semibold max-w-3xl mx-auto leading-relaxed">
            Conversaciones a veces entre amigos, a veces con expertos en algún tema con algo que decir que podría contribuir a sentirnos mejor. Esas charlas que simplemente hacen que te sientas bien después de tenerlas.
          </p>
        </div>

        <div className="mb-12">
          <Card className="overflow-hidden border-4 border-black shadow-2xl rounded-organic transition-transform duration-300 hover:scale-[1.01]" style={{ backgroundColor: 'transparent' }}>
            <CardContent className="p-6 lg:p-10 !bg-[#fdd91f]" style={{ backgroundColor: '#fdd91f' }}>
              <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-black text-black leading-tight text-shadow-warm">
                      {featuredEpisode?.title}
                    </h3>
                    <div className="flex flex-wrap gap-6 text-sm text-black font-semibold">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredEpisode?.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredEpisode?.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-800 text-lg leading-relaxed font-semibold">{heroCopy}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full max-w-xl">
                      {featuredEpisode && (
                        <iframe
                          title="Último episodio"
                          src={normalizeEmbedUrl(featuredEpisode.spotify_embed_url) ?? buildEmbedUrl(featuredEpisode.spotify_id, featuredEpisode.spotify_url, true) ?? featuredSpotifyLink}
                          className="w-full rounded-2xl border-2 border-black block"
                          style={{ height: "80px" }}
                          frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        asChild
                        size="lg"
                        className="bg-black hover:bg-gray-800 !text-[#fdd91f] font-bold border-4 border-black rounded-full px-8 py-3 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        style={{ color: '#fdd91f' }}
                      >
                        <a href={featuredSpotifyLink} target="_blank" rel="noreferrer" style={{ color: '#fdd91f' }}>
                          <ExternalLink className="h-5 w-5 mr-2" />
                          Ver en Spotify
                        </a>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        className="bg-white hover:bg-gray-100 text-black font-bold border-4 border-black rounded-full px-8 py-3 transform hover:scale-105 transition-all duration-200 shadow-lg"
                      >
                        <a href="https://www.youtube.com/@metaforicapodcast" target="_blank" rel="noreferrer">
                          <Youtube className="h-5 w-5 mr-2" />
                          Ver en YouTube
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 mb-12">
          {secondaryEpisodes.map((episode, index) => (
            <Card
              key={`${episode.id}-${index}`}
              className="overflow-hidden hover:shadow-2xl transition-transform duration-300 border-2 border-black bg-gradient-to-r from-yellow-100 to-amber-100 rounded-organic hover:scale-[1.02]"
            >
              <CardContent className="p-6">
                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="text-lg font-black text-black leading-tight">{episode.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-black font-semibold mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{episode.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{episode.duration}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-semibold">
                    {truncateWords(episode.description, 30)}
                  </p>
                </div>
                <div className="rounded-organic overflow-hidden border-2 border-black">
                  {(episode.spotify_embed_url ||
                    buildEmbedUrl(episode.spotify_id, episode.spotify_url)) && (
                    <iframe
                      title={`Episodio ${index + 2}`}
                      src={
                        episode.spotify_embed_url ??
                        buildEmbedUrl(episode.spotify_id, episode.spotify_url, true) ??
                        featuredSpotifyLink
                      }
                      className="w-full block"
                      style={{ height: "80px" }}
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-8 !bg-[#fdd91f] p-12 rounded-organic border-4 border-black shadow-2xl" style={{ backgroundColor: '#fdd91f' }}>
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-black text-shadow-warm transform -rotate-1">
              ¡No te Pierdas Ningún Episodio!
            </h3>
            <p className="text-gray-800 font-semibold max-w-2xl mx-auto text-lg">
              Suscríbete al podcast y recibe notificaciones cuando publiquemos nuevos episodios llenos de reflexiones
              y conversaciones que pueden transformar tu perspectiva.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
              asChild
            >
              <a href="https://open.spotify.com/show/0gC3vpRw7USZCJ9kHPrl5N" target="_blank" rel="noopener noreferrer">
                <Music className="h-5 w-5 mr-2" />
                Suscribirse en Spotify
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
              asChild
            >
              <a href="https://www.youtube.com/@metaforicapodcast" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5 mr-2" />
                Ver en YouTube
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
