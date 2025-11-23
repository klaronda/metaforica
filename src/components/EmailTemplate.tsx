import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, Headphones, FileText, ExternalLink, ArrowRight } from "lucide-react";

interface EmailTemplateProps {
  // Hero Feature
  heroType: 'book' | 'podcast' | 'blog';
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroCtaText: string;
  heroCtaLink: string;
  
  // Additional Content
  blogPosts?: {
    title: string;
    excerpt: string;
    link: string;
    date: string;
  }[];
  
  podcastEpisodes?: {
    title: string;
    description: string;
    link: string;
    duration: string;
  }[];
  
  // Upsell
  upsellTitle: string;
  upsellDescription: string;
  upsellImage: string;
  upsellCtaText: string;
  upsellCtaLink: string;
  upsellPrice?: string;
}

export function EmailTemplate({
  heroType,
  heroTitle,
  heroDescription,
  heroImage,
  heroCtaText,
  heroCtaLink,
  blogPosts = [],
  podcastEpisodes = [],
  upsellTitle,
  upsellDescription,
  upsellImage,
  upsellCtaText,
  upsellCtaLink,
  upsellPrice
}: EmailTemplateProps) {
  
  const getHeroIcon = () => {
    switch (heroType) {
      case 'book':
        return <BookOpen className="h-8 w-8" />;
      case 'podcast':
        return <Headphones className="h-8 w-8" />;
      case 'blog':
        return <FileText className="h-8 w-8" />;
    }
  };

  const getHeroColor = () => {
    switch (heroType) {
      case 'book':
        return 'from-amber-400 to-orange-500';
      case 'podcast':
        return 'from-purple-400 to-pink-500';
      case 'blog':
        return 'from-blue-400 to-cyan-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Email Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 text-center border-b-4 border-amber-400">
        <h1 className="text-3xl text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Metaforica
        </h1>
        <p className="text-amber-700 text-sm">
          Explorando el lenguaje del alma
        </p>
      </div>

      {/* Hero Section */}
      <div className="p-8">
        <div className={`bg-gradient-to-br ${getHeroColor()} rounded-organic p-1 mb-6`}>
          <div className="bg-white rounded-organic p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`bg-gradient-to-br ${getHeroColor()} text-white p-3 rounded-lg`}>
                {getHeroIcon()}
              </div>
              <div className="text-sm uppercase tracking-wide font-semibold text-gray-600">
                {heroType === 'book' && '📚 Nuevo Libro'}
                {heroType === 'podcast' && '🎙️ Nuevo Episodio'}
                {heroType === 'blog' && '✍️ Nueva Entrada'}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl mb-4">
                  {heroTitle}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {heroDescription}
                </p>
                <a 
                  href={heroCtaLink}
                  className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-500 hover:to-orange-600 transition-all"
                  style={{ textDecoration: 'none' }}
                >
                  {heroCtaText} →
                </a>
              </div>
              <div>
                <img 
                  src={heroImage} 
                  alt={heroTitle}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      {blogPosts.length > 0 && (
        <div className="px-8 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="text-xl">Últimas Entradas del Blog</h3>
          </div>
          <div className="space-y-4">
            {blogPosts.map((post, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{post.title}</h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{post.date}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <a 
                  href={post.link}
                  className="text-blue-600 text-sm hover:text-blue-700 inline-flex items-center gap-1"
                  style={{ textDecoration: 'none' }}
                >
                  Leer más <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Podcast Episodes Section */}
      {podcastEpisodes.length > 0 && (
        <div className="px-8 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Headphones className="h-5 w-5 text-purple-500" />
            <h3 className="text-xl">Episodios Recientes</h3>
          </div>
          <div className="space-y-4">
            {podcastEpisodes.map((episode, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-400 hover:shadow-md transition-all bg-gradient-to-r from-purple-50/50 to-pink-50/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{episode.title}</h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">🎧 {episode.duration}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {episode.description}
                </p>
                <a 
                  href={episode.link}
                  className="text-purple-600 text-sm hover:text-purple-700 inline-flex items-center gap-1"
                  style={{ textDecoration: 'none' }}
                >
                  Escuchar ahora <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upsell Section */}
      <div className="px-8 pb-8">
        <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 rounded-organic p-6 border-2 border-amber-300">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <img 
                src={upsellImage} 
                alt={upsellTitle}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="md:col-span-2">
              <div className="inline-block bg-amber-500 text-white text-xs px-3 py-1 rounded-full mb-3">
                ✨ OFERTA ESPECIAL
              </div>
              <h3 className="text-2xl mb-3">
                {upsellTitle}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {upsellDescription}
              </p>
              {upsellPrice && (
                <div className="text-3xl text-amber-700 mb-4">
                  {upsellPrice}
                </div>
              )}
              <a 
                href={upsellCtaLink}
                className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg"
                style={{ textDecoration: 'none' }}
              >
                {upsellCtaText} →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-8 text-center border-t border-gray-200">
        <div className="mb-4">
          <h4 className="text-sm mb-3">Sígueme en las redes</h4>
          <div className="flex justify-center gap-4">
            <a href="#" className="text-gray-600 hover:text-pink-600">Instagram</a>
            <a href="#" className="text-gray-600 hover:text-green-600">Spotify</a>
            <a href="#" className="text-gray-600 hover:text-red-600">YouTube</a>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          Recibiste este correo porque te suscribiste a Metaforica
        </p>
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-700">Preferencias de email</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-700">Darse de baja</a>
        </div>
      </div>
    </div>
  );
}
