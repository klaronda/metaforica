import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart, BookOpen, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";
import { supabase } from "../lib/supabase";

export function BooksSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error("Por favor, ingresa un email válido");
      return;
    }

    try {
      // Upsert: insert if new, update if exists (reactivate if previously unsubscribed)
      const { error } = await supabase
        .from("email_subscribers")
        .upsert({
          email: email.trim().toLowerCase(),
          is_active: true,
          pref_books: true,
          subscribed_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        });

      if (error) throw error;

      toast.success("¡Gracias por suscribirte!", {
        description: "Pronto recibirás actualizaciones sobre nuevos lanzamientos y contenido exclusivo.",
        duration: 5000,
      });
      setEmail("");
    } catch (error: any) {
      console.error("Error subscribing email:", error);
      toast.error("Error al suscribirte. Por favor intenta de nuevo.");
    }
  };

  const books = [
    {
      title: "¿California?",
      subtitle: "Decisiones, aventuras y más.",
      description: "Una joven de casi 30 años en Lima parece tenerlo todo, hasta que un viaje de trabajo desafía sus creencias sobre trabajo, vocación y amor. Un viaje que termina volteando su mundo de cabeza.",
      price: "$2.99",
      rating: 5.0,
      reviews: 2,
      isNewRelease: false,
      available: ["Kindle"],
      amazonUrl: "https://www.amazon.com/-/es/Alexandra-Torre-ebook/dp/B0D278TLZ7"
    }
  ];

  return (
    <section id="books" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Libros Publicados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Para momentos offline, algunos escritos de formato más largo. Una amiga que te acompaña en la cartera, en el bus o en un café. El primer libro publicado fue una novela en el 2024 y ahora en el 2026 tenemos nuestro segundo libro a publicar este noviembre que será un poco distinto.
          </p>
        </div>

        {/* Books grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {books.map((book, index) => (
            <Card key={index} className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                  {/* Book cover */}
                  <div className="md:col-span-2 relative">
                    <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 flex items-center justify-center relative" style={{ maxHeight: '150px', height: '150px', overflow: 'hidden' }}>
                      <ImageWithFallback
                        src="https://m.media-amazon.com/images/I/91lAtXn4cyL._SY385_.jpg"
                        alt={book.title}
                        className="max-h-[150px] w-auto object-contain"
                        style={{ maxHeight: '150px' }}
                      />
                      {book.isNewRelease && (
                        <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                          NUEVO
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Book details */}
                  <div className="md:col-span-3 p-8 flex flex-col justify-center">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-lg text-amber-600 font-medium">
                          {book.subtitle}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          {book.description}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(book.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {book.rating} ({book.reviews} reseñas)
                        </span>
                      </div>

                      {/* Available formats */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Disponible en:</p>
                        <div className="flex flex-wrap gap-2">
                          {book.available.map((format, i) => (
                            <Badge key={i} variant="secondary">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Price and buttons */}
                      <div className="space-y-4">
                        <div className="text-2xl font-bold text-amber-600">
                          {book.price}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                            onClick={() => book.amazonUrl && window.open(book.amazonUrl, '_blank')}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Comprar Ahora
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-0">
          <CardContent className="p-8 lg:p-12 text-center">
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Mantente al tanto de todo lo que sucede aquí
                </h3>
                <p className="text-gray-600 text-lg">
                  ¿Un poco de inspiración esperándote en tu inbox? Sí, sí, sí. Recibe de forma directa actualizaciones de nuestro blog, libros e información de eventos.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
                  Suscribirse
                </Button>
              </form>

              <p className="text-xs text-gray-500">
                No spam, solo contenido valioso. Cancela tu suscripción cuando quieras.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}