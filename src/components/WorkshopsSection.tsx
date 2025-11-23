import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Users, MapPin, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function WorkshopsSection() {
  const workshops = [
    {
      title: "Taller de Escritura Creativa",
      subtitle: "Encuentra tu Voz Auténtica",
      description: "Un espacio seguro para explorar tu creatividad y desarrollar tu estilo único de escritura. Aprende técnicas narrativas y descubre el poder de las metáforas.",
      price: "$150",
      duration: "4 semanas",
      format: "Online",
      participants: "Máximo 12 personas",
      nextDate: "15 Sep 2024",
      rating: 4.9,
      reviews: 34,
      isPopular: true
    },
    {
      title: "Coaching Personal Individual",
      subtitle: "Tu Camino hacia la Autenticidad",
      description: "Sesiones personalizadas para explorar tus patrones, desbloquear tu potencial y diseñar una vida más alineada con tus valores auténticos.",
      price: "$120/sesión",
      duration: "1 hora",
      format: "Online/Presencial",
      participants: "1:1",
      nextDate: "Disponible",
      rating: 5.0,
      reviews: 28,
      isPopular: false
    },
    {
      title: "Círculo de Reflexión",
      subtitle: "Comunidad de Crecimiento",
      description: "Un grupo íntimo donde compartimos experiencias, reflexiones y apoyamos mutuamente nuestro crecimiento personal en un ambiente de confianza.",
      price: "$80/mes",
      duration: "2 sesiones/mes",
      format: "Online",
      participants: "6-8 personas",
      nextDate: "1 Oct 2024",
      rating: 4.8,
      reviews: 15,
      isPopular: false
    }
  ];

  return (
    <section id="workshops" className="py-16 lg:py-24 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Talleres y Coaching
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Espacios de crecimiento donde exploramos juntos el arte de vivir conscientemente. 
            Desde escritura creativa hasta coaching personal, cada experiencia está diseñada 
            para potenciar tu desarrollo personal.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-64 md:h-80">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1676276376345-ee600f57b5b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FjaGluZyUyMHdvcmtzaG9wJTIwcGVvcGxlfGVufDF8fHx8MTc1NTI3OTY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Workshop environment"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Transforma tu Vida</h3>
              <p className="text-lg opacity-90">A través del autoconocimiento y la escritura</p>
            </div>
          </div>
        </div>

        {/* Workshops grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {workshops.map((workshop, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow h-full">
              <CardHeader className="space-y-4 relative">
                {workshop.isPopular && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                    POPULAR
                  </Badge>
                )}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {workshop.title}
                  </h3>
                  <p className="text-amber-600 font-medium">
                    {workshop.subtitle}
                  </p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {workshop.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(workshop.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {workshop.rating} ({workshop.reviews} reseñas)
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Workshop details */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>{workshop.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    <span>{workshop.format}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-amber-500" />
                    <span>{workshop.participants}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    <span>Próximo: {workshop.nextDate}</span>
                  </div>
                </div>

                {/* Price and button */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="text-2xl font-bold text-amber-600">
                    {workshop.price}
                  </div>
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    size="lg"
                  >
                    Reservar Lugar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonial */}
        <Card className="bg-white border-0 shadow-xl mb-12">
          <CardContent className="p-8 lg:p-12">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed italic">
                "Los talleres de Alexandra no son solo sobre técnica, son sobre encontrarte contigo mismo. 
                Cada sesión fue un viaje profundo que cambió mi forma de ver la escritura y la vida."
              </blockquote>
              <div className="space-y-1">
                <div className="font-semibold text-gray-900">María Elena Rodríguez</div>
                <div className="text-sm text-gray-600">Participante del Taller de Escritura Creativa</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              ¿Listo para Comenzar tu Transformación?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cada viaje comienza con un primer paso. Agenda una consulta gratuita de 30 minutos 
              para descubrir cómo podemos trabajar juntos en tu crecimiento personal.
            </p>
          </div>
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
            <Calendar className="h-5 w-5 mr-2" />
            Agendar Consulta Gratuita
          </Button>
        </div>
      </div>
    </section>
  );
}