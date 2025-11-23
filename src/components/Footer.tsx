import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Heart, Mail, Instagram, Music, Youtube } from "lucide-react";

const currentYear = new Date().getFullYear();

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-black text-yellow-400 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full opacity-10 -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-400 rounded-full opacity-10 translate-x-16 translate-y-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-yellow-400 text-shadow-warm transform -rotate-1">Metafórica</h3>
                <p className="text-gray-300 leading-relaxed max-w-md font-semibold">
                  Un espacio donde las palabras se convierten en puentes hacia el autoconocimiento. 
                  Únete a esta comunidad de buscadores y transformemos juntos la manera en que 
                  entendemos la vida.
                </p>
              </div>
              
              {/* Newsletter signup */}
              <div className="space-y-4">
                <h4 className="text-xl font-black text-white">¡Mantente Conectado!</h4>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <Input
                    type="email"
                    placeholder="Tu email"
                    className="bg-yellow-400 border-2 border-black text-black placeholder-gray-700 focus:border-white font-semibold rounded-full"
                  />
                  <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-full border-2 border-black shadow-lg transform hover:scale-105 transition-all duration-200">
                    <Mail className="h-4 w-4 mr-2" />
                    Suscribirse
                  </Button>
                </div>
                <p className="text-xs text-gray-400 font-semibold">
                  Recibe reflexiones exclusivas y actualizaciones del podcast.
                </p>
              </div>
            </div>

            {/* Quick links */}
            <div className="space-y-6">
              <h4 className="text-xl font-black text-white">Explorar</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#blog" className="text-gray-300 hover:text-yellow-400 transition-all duration-200 font-semibold hover:scale-105 inline-block">
                    Últimos Escritos
                  </a>
                </li>
                <li>
                  <a href="#podcast" className="text-gray-300 hover:text-yellow-400 transition-all duration-200 font-semibold hover:scale-105 inline-block">
                    Episodios del Podcast
                  </a>
                </li>
                <li>
                  <a href="#books" className="text-gray-300 hover:text-yellow-400 transition-all duration-200 font-semibold hover:scale-105 inline-block">
                    Libros
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-yellow-400 transition-all duration-200 font-semibold hover:scale-105 inline-block">
                    Sobre Alexandra
                  </a>
                </li>
              </ul>
            </div>

            {/* Social links */}
            <div className="space-y-6">
              <h4 className="text-xl font-black text-white">Sígueme</h4>
              <div className="space-y-4">
                <a 
                  href="https://www.instagram.com/metaforica.podcast/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-yellow-400 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center group-hover:bg-white transition-all duration-200 shadow-lg transform group-hover:scale-110 border-2 border-black">
                    <Instagram className="h-6 w-6 text-black" />
                  </div>
                  <span className="font-semibold">Instagram</span>
                </a>
                <a 
                  href="https://open.spotify.com/show/0gC3vpRw7USZCJ9kHPrl5N"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-white transition-all duration-200 shadow-lg transform group-hover:scale-110 border-2 border-black">
                    <Music className="h-6 w-6 text-black" />
                  </div>
                  <span className="font-semibold">Spotify</span>
                </a>
                <a 
                  href="https://www.youtube.com/@metaforicapodcast"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-red-400 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-white transition-all duration-200 shadow-lg transform group-hover:scale-110 border-2 border-black">
                    <Youtube className="h-6 w-6 text-black" />
                  </div>
                  <span className="font-semibold">YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="py-8 border-t-4 border-yellow-400">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="text-sm text-gray-400 font-semibold">
                © {currentYear} Alexandra De la Torre. Todos los derechos reservados.
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('emailPreferences')}
                  className="text-sm text-gray-400 hover:text-yellow-400 transition-colors underline font-semibold"
                >
                  Gestionar Preferencias de Email
                </button>
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400 font-semibold">
              <span>Hecho con</span>
              <Heart className="h-4 w-4 text-yellow-400 animate-pulse" />
              <span>para la comunidad de buscadores</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}