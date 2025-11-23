import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart, BookOpen, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";
import { useState } from "react";

export function BooksSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      toast.success("¡Gracias por suscribirte!", {
        description: "Pronto recibirás actualizaciones sobre nuevos lanzamientos y contenido exclusivo.",
        duration: 5000,
      });
      setEmail("");
    } else {
      toast.error("Por favor, ingresa un email válido");
    }
  };

  const books = [
    {
      title: "Metáforas del Alma",
      subtitle: "Un Viaje hacia el Autoconocimiento",
      description: "Una colección de reflexiones profundas sobre la condición humana, utilizando metáforas cotidianas para explorar los rincones más íntimos de nuestra psique.",
      price: "$24.99",
      rating: 4.8,
      reviews: 127,
      isNewRelease: true,
      available: ["Kindle", "Tapa Blanda", "Audiolibro"]
    },
    {
      title: "Conversaciones Conmigo Misma",
      subtitle: "Diarios de una Buscadora",
      description: "Un compilado íntimo de pensamientos, dudas y revelaciones que nacieron durante mi proceso personal de crecimiento y autodescubrimiento.",
      price: "$19.99",
      rating: 4.6,
      reviews: 89,
      isNewRelease: false,
      available: ["Kindle", "Tapa Blanda"]
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
            Obras que invitan a la reflexión profunda y al crecimiento personal. 
            Cada libro es un compañero en tu viaje hacia una vida más consciente y auténtica.
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
                    <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 flex items-center justify-center relative">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1487147264018-f937fba0c817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBkZXNpZ258ZW58MXx8fHwxNzU1Mjc5NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt={book.title}
                        className="w-full h-full object-cover"
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
                          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
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
                  Sé la Primera en Conocer Nuevos Lanzamientos
                </h3>
                <p className="text-gray-600 text-lg">
                  Únete a nuestra comunidad de lectores y recibe actualizaciones exclusivas, 
                  fragmentos de libros próximos y reflexiones especiales directamente en tu inbox.
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