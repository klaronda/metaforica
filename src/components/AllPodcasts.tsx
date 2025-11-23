import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Play, Search, X, Calendar, Clock, ExternalLink, Youtube, Music } from "lucide-react";

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishDate: string;
  spotifyUrl: string;
  youtubeUrl?: string;
  tags: string[];
  episodeNumber: number;
  season?: number;
}

// Mock podcast data organized by month/year
const podcastEpisodes: PodcastEpisode[] = [
  {
    id: '1',
    title: 'El Lenguaje Secreto de las Metáforas',
    description: 'Exploramos cómo las metáforas moldean nuestra percepción del mundo y nos ayudan a comunicar ideas complejas de manera accesible.',
    duration: '32:45',
    publishDate: '2024-01-28',
    spotifyUrl: 'https://open.spotify.com/episode/example1',
    youtubeUrl: 'https://youtube.com/watch?v=example1',
    tags: ['metáforas', 'lenguaje', 'comunicación'],
    episodeNumber: 15,
    season: 2
  },
  {
    id: '2',
    title: 'Escribir desde el Corazón: Autenticidad en la Era Digital',
    description: 'Una conversación profunda sobre cómo mantener la autenticidad en nuestra escritura mientras navegamos las demandas del mundo digital.',
    duration: '28:30',
    publishDate: '2024-01-14',
    spotifyUrl: 'https://open.spotify.com/episode/example2',
    youtubeUrl: 'https://youtube.com/watch?v=example2',
    tags: ['autenticidad', 'escritura digital', 'creatividad'],
    episodeNumber: 14,
    season: 2
  },
  {
    id: '3',
    title: 'La Magia de los Primeros Párrafos',
    description: 'Analizamos qué hace que un primer párrafo sea irresistible y cómo capturar la atención del lector desde la primera línea.',
    duration: '25:15',
    publishDate: '2023-12-20',
    spotifyUrl: 'https://open.spotify.com/episode/example3',
    tags: ['primeros párrafos', 'engagement', 'técnica'],
    episodeNumber: 13,
    season: 2
  },
  {
    id: '4',
    title: 'Conversación con una Editora: El Arte de Pulir Historias',
    description: 'Entrevista especial con una editora experimentada sobre el proceso de edición y cómo mejorar nuestros manuscritos.',
    duration: '45:20',
    publishDate: '2023-12-06',
    spotifyUrl: 'https://open.spotify.com/episode/example4',
    youtubeUrl: 'https://youtube.com/watch?v=example4',
    tags: ['edición', 'entrevista', 'proceso creativo'],
    episodeNumber: 12,
    season: 2
  },
  {
    id: '5',
    title: 'Rituales de Escritura: Creando Espacio para la Creatividad',
    description: 'Exploramos diferentes rituales y técnicas para crear un ambiente propicio para la escritura creativa.',
    duration: '30:45',
    publishDate: '2023-11-22',
    spotifyUrl: 'https://open.spotify.com/episode/example5',
    tags: ['rituales', 'creatividad', 'productividad'],
    episodeNumber: 11,
    season: 2
  },
  {
    id: '6',
    title: 'El Poder de las Historias Personales',
    description: 'Cómo nuestras experiencias personales pueden convertirse en narrativas universales que conecten con otros.',
    duration: '33:10',
    publishDate: '2023-11-08',
    spotifyUrl: 'https://open.spotify.com/episode/example6',
    youtubeUrl: 'https://youtube.com/watch?v=example6',
    tags: ['historias personales', 'narrativa', 'conexión'],
    episodeNumber: 10,
    season: 2
  }
];

// Group episodes by month and year
const groupEpisodesByMonth = (episodes: PodcastEpisode[]) => {
  const grouped: { [key: string]: PodcastEpisode[] } = {};
  
  episodes.forEach(episode => {
    const date = new Date(episode.publishDate);
    const monthYear = date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    });
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(episode);
  });
  
  // Sort episodes within each month by date (newest first)
  Object.keys(grouped).forEach(monthYear => {
    grouped[monthYear].sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  });
  
  return grouped;
};

export function AllPodcasts() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredEpisodes = podcastEpisodes.filter(episode => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      episode.title.toLowerCase().includes(query) ||
      episode.description.toLowerCase().includes(query) ||
      episode.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const groupedEpisodes = groupEpisodesByMonth(filteredEpisodes);
  const monthYears = Object.keys(groupedEpisodes).sort((a, b) => {
    const dateA = new Date(groupedEpisodes[a][0].publishDate);
    const dateB = new Date(groupedEpisodes[b][0].publishDate);
    return dateB.getTime() - dateA.getTime();
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl text-shadow-warm mb-4 transform -rotate-1">
            Podcast Metafórica
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Conversaciones profundas sobre escritura, creatividad y el poder transformador de las historias
          </p>
          
          {/* Platform Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white shadow-xl transform hover:scale-105 transition-all duration-200"
              asChild
            >
              <a 
                href="https://open.spotify.com/show/0gC3vpRw7USZCJ9kHPrl5N" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Escuchar en Spotify (abre en una nueva ventana)"
              >
                <Music className="h-5 w-5 mr-2" aria-hidden="true" />
                Escuchar en Spotify
                <ExternalLink className="h-4 w-4 ml-2" aria-hidden="true" />
              </a>
            </Button>
            <Button 
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white shadow-xl transform hover:scale-105 transition-all duration-200"
              asChild
            >
              <a 
                href="https://www.youtube.com/@metaforicapodcast" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Ver en YouTube (abre en una nueva ventana)"
              >
                <Youtube className="h-5 w-5 mr-2" aria-hidden="true" />
                Ver en YouTube
                <ExternalLink className="h-4 w-4 ml-2" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-organic border-2 border-primary/20 p-6 mb-8 shadow-lg">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar episodios..."
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
          
          {searchQuery && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              {filteredEpisodes.length} episodio{filteredEpisodes.length !== 1 ? 's' : ''} encontrado{filteredEpisodes.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Episodes by Month */}
        {monthYears.length > 0 ? (
          <div className="space-y-12">
            {monthYears.map((monthYear) => (
              <div key={monthYear}>
                {/* Month Header */}
                <div className="mb-6">
                  <h2 className="text-2xl lg:text-3xl text-shadow-warm capitalize transform -rotate-1 inline-block">
                    {monthYear}
                  </h2>
                  <div className="h-1 bg-gradient-to-r from-primary to-golden-orange rounded-full mt-2 w-24"></div>
                </div>

                {/* Episodes Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {groupedEpisodes[monthYear].map((episode) => (
                    <Card key={episode.id} className="rounded-organic border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl group bg-white">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-primary text-primary-foreground">
                              EP {episode.episodeNumber}
                            </Badge>
                            {episode.season && (
                              <Badge variant="outline">
                                T{episode.season}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {episode.duration}
                          </div>
                        </div>
                        
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                          {episode.title}
                        </CardTitle>
                        
                        <CardDescription className="line-clamp-3">
                          {episode.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                          <Calendar className="h-3 w-3" />
                          {formatDate(episode.publishDate)}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {episode.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="text-xs bg-muted px-2 py-1 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            variant="default" 
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            asChild
                          >
                            <a 
                              href={episode.spotifyUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label={`Escuchar episodio "${episode.title}" en Spotify (abre en una nueva ventana)`}
                            >
                              <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                              Escuchar en Spotify
                              <ExternalLink className="h-3 w-3 ml-2" aria-hidden="true" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <div className="bg-white rounded-organic border-2 border-border p-8 max-w-md mx-auto">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">No se encontraron episodios</h3>
              <p className="text-muted-foreground mb-4">
                Intenta con diferentes términos de búsqueda.
              </p>
              <Button 
                onClick={() => setSearchQuery('')}
                variant="outline"
              >
                Ver todos los episodios
              </Button>
            </div>
          </div>
        )}

        {/* Subscribe Section */}
        <div className="mt-16 bg-gradient-to-r from-primary to-golden-orange rounded-organic p-8 text-center text-primary-foreground">
          <h3 className="text-2xl mb-4">¿Te gustó lo que escuchaste?</h3>
          <p className="text-lg mb-6 opacity-90">
            Suscríbete al podcast para no perderte ningún episodio
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="secondary" 
              className="bg-white text-primary hover:bg-gray-100"
              asChild
            >
              <a 
                href="https://open.spotify.com/show/metaforica" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Suscribirse al podcast Metafórica en Spotify (abre en una nueva ventana)"
              >
                Suscribirse en Spotify
                <ExternalLink className="h-4 w-4 ml-2" aria-hidden="true" />
              </a>
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <a 
                href="https://youtube.com/@metaforica" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Suscribirse al canal de YouTube de Metafórica (abre en una nueva ventana)"
              >
                <Youtube className="h-4 w-4 mr-2" aria-hidden="true" />
                Suscribirse en YouTube
                <ExternalLink className="h-4 w-4 ml-2" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}