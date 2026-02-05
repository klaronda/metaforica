import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Quote, Heart, BookOpen, Mic, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase } from "../lib/supabase";

export function AboutSection() {
  const [hero, setHero] = useState({
    title: "Sobre Alexandra",
    subtitle:
      "Una escritora peruana-americana viviendo en la costa oeste de los Estados Unidos, dedicada a explorar las profundidades del alma humana a través de las palabras.",
    profileImageUrl:
      "https://images.unsplash.com/photo-1639986162505-c9bcccfc9712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvZGNhc3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjgwMDMzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    profileImageAlt: "Alexandra De la Torre - Host de Metafórica"
  });

  const [biographyParagraphs, setBiographyParagraphs] = useState([
    "Soy Alexandra De la Torre, una buscadora incansable de verdades humanas que se esconden en las experiencias más cotidianas. Mi viaje comenzó con una simple pregunta: ¿por qué vivimos como vivimos?",
    "A través del podcast Metafórica, exploro junto a mis oyentes las metáforas que dan forma a nuestras vidas. Cada conversación es una invitación a mirar más profundo, a cuestionar lo obvio y a encontrar belleza en la complejidad de ser humano.",
    "Mi trabajo como escritora y coach se centra en ayudar a las personas a encontrar su voz auténtica y a vivir con mayor consciencia e intención."
  ]);

  const [values, setValues] = useState(["Autenticidad", "Vulnerabilidad", "Curiosidad", "Compasión", "Crecimiento"]);

  const [achievements, setAchievements] = useState([
    { icon: "mic", label: "103+ Episodios", description: "De conversaciones profundas" },
    { icon: "book", label: "2 Libros", description: "Publicados y en proceso" },
    { icon: "heart", label: "15K+ Oyentes", description: "Comunidad global" },
    { icon: "quote", label: "500+ Reflexiones", description: "Compartidas en redes" }
  ]);

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      if (!supabase) return;

      try {
        const { data, error } = await supabase.from("about_page_content").select("*");
        if (error) {
          throw error;
        }

        if (!active || !data?.length) return;

        const heroRow = data.find((row) => row.section_type === "hero");
        const biographyRow = data.find((row) => row.section_type === "biography");
        const valuesRow = data.find((row) => row.section_type === "values");
        const achievementsRow = data.find((row) => row.section_type === "achievements");

        if (heroRow?.content) {
          const heroContent = heroRow.content as {
            title?: string;
            subtitle?: string;
            profile_image_url?: string;
            profile_image_alt?: string;
          };
          setHero((prev) => ({
            ...prev,
            title: heroContent.title ?? prev.title,
            subtitle: heroContent.subtitle ?? prev.subtitle,
            profileImageUrl: heroContent.profile_image_url ?? prev.profileImageUrl,
            profileImageAlt: heroContent.profile_image_alt ?? prev.profileImageAlt
          }));
        }

        if (biographyRow?.content) {
          const biographyContent = biographyRow.content as { content?: string[] };
          if (biographyContent.content?.length) {
            setBiographyParagraphs(biographyContent.content);
          }
        }

        if (valuesRow?.content) {
          const valuesContent = valuesRow.content as { items?: string[] };
          if (valuesContent.items?.length) {
            setValues(valuesContent.items);
          }
        }

        if (achievementsRow?.content) {
          const achievementsContent = achievementsRow.content as { cards?: typeof achievements };
          if (achievementsContent.cards?.length) {
            setAchievements(achievementsContent.cards);
          }
        }
      } catch (error) {
        console.error("Failed to load About page content:", error);
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, []);

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "mic":
        return Mic;
      case "book":
        return BookOpen;
      case "heart":
        return Heart;
      case "quote":
        return Quote;
      default:
        return Mic;
    }
  };

  return (
    <section id="about" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {hero.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {hero.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Profile image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-96 lg:h-[500px]">
                <ImageWithFallback
                  src={hero.profileImageUrl}
                  alt={hero.profileImageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-400 rounded-full opacity-20"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-orange-400 rounded-full opacity-30"></div>
            </div>
          </div>

          {/* Bio content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Mi Historia
                </h3>
              {biographyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-600 leading-relaxed whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Mis Valores</h4>
                <div className="flex flex-wrap gap-2">
                  {values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {achievements.map((achievement, index) => {
            const IconComponent = getAchievementIcon(achievement.icon);
            return (
            <Card key={index} className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {achievement.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {achievement.description}
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Philosophy */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-0">
          <CardContent className="p-8 lg:p-12">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Quote className="h-12 w-12 text-amber-500 mx-auto" />
              <blockquote className="text-2xl lg:text-3xl text-gray-700 leading-relaxed font-medium">
                "Creo profundamente en el poder transformador de las historias. 
                Cada persona lleva dentro un universo de experiencias que, 
                al ser compartidas con vulnerabilidad y honestidad, 
                tienen el poder de sanar, inspirar y conectar."
              </blockquote>
              <div className="space-y-2">
                <div className="font-semibold text-lg text-gray-900">Alexandra De la Torre</div>
                <div className="text-amber-600">Host de Metafórica • Escritora • Coach Personal</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coach session CTA */}
        <Card className="bg-[#fdd91f] border-4 border-black shadow-xl" style={{ marginTop: '40px' }}>
          <CardContent className="p-8 lg:p-12 text-center">
            <div className="space-y-6 max-w-2xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-black text-black">
                Agenda una sesión de coach con Metafórica
              </h3>
              <Button
                asChild
                size="lg"
                className="bg-black hover:bg-gray-800 !text-[#fdd91f] font-bold border-4 border-black rounded-full px-8 py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                style={{ color: '#fdd91f' }}
              >
                <a href="https://tr.ee/JwBV9dGt87" target="_blank" rel="noreferrer" className="!text-[#fdd91f] hover:!text-[#fee568]" style={{ color: '#fdd91f' }}>
                  <Calendar className="h-5 w-5 mr-2 inline" style={{ color: 'inherit' }} />
                  Reservar ahora
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}