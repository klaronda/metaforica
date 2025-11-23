import { useState } from "react";
import { EmailTemplate } from "./EmailTemplate";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Mail, 
  Eye, 
  Send, 
  Copy, 
  Download,
  Plus,
  Trash2,
  BookOpen,
  Headphones,
  FileText,
  CheckCircle,
  X
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface BlogPostItem {
  title: string;
  excerpt: string;
  link: string;
  date: string;
}

interface PodcastItem {
  title: string;
  description: string;
  link: string;
  duration: string;
}

export function EmailTemplateManager() {
  // Hero Section State
  const [heroType, setHeroType] = useState<'book' | 'podcast' | 'blog'>('book');
  const [heroTitle, setHeroTitle] = useState("Mi Nuevo Libro: El Arte de las Metáforas");
  const [heroDescription, setHeroDescription] = useState("Descubre cómo las metáforas pueden transformar tu forma de pensar y comunicar. Un viaje profundo a través del lenguaje del alma.");
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800");
  const [heroCtaText, setHeroCtaText] = useState("Comprar Ahora");
  const [heroCtaLink, setHeroCtaLink] = useState("https://metaforica.com/libros");

  // Blog Posts State
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([
    {
      title: "La Metáfora del Espejo: Reflexiones sobre la Autenticidad",
      excerpt: "Exploramos cómo las metáforas que usamos para describir nuestra vida afectan nuestra experiencia diaria.",
      link: "https://metaforica.com/blog/metafora-espejo",
      date: "10 Nov 2024"
    },
    {
      title: "Escribir desde el Corazón: Una Guía Práctica",
      excerpt: "Descubre técnicas para conectar con tu voz auténtica y escribir con pasión y propósito.",
      link: "https://metaforica.com/blog/escribir-corazon",
      date: "3 Nov 2024"
    }
  ]);

  // Podcast Episodes State
  const [podcastEpisodes, setPodcastEpisodes] = useState<PodcastItem[]>([
    {
      title: "El Lenguaje Secreto de las Metáforas",
      description: "Exploramos cómo las metáforas moldean nuestra percepción del mundo y nuestras relaciones.",
      link: "https://open.spotify.com/episode/example1",
      duration: "32:45"
    }
  ]);

  // Upsell State
  const [upsellTitle, setUpsellTitle] = useState("Curso Online: Escritura Transformadora");
  const [upsellDescription, setUpsellDescription] = useState("Aprende a escribir con autenticidad y propósito. Un curso de 6 semanas que transformará tu relación con la escritura.");
  const [upsellImage, setUpsellImage] = useState("https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400");
  const [upsellCtaText, setUpsellCtaText] = useState("Inscríbete Ahora");
  const [upsellCtaLink, setUpsellCtaLink] = useState("https://metaforica.com/cursos");
  const [upsellPrice, setUpsellPrice] = useState("$99");

  // UI State
  const [activeTab, setActiveTab] = useState("preview");
  const [includeBlogPosts, setIncludeBlogPosts] = useState(true);
  const [includePodcasts, setIncludePodcasts] = useState(true);

  const handleCopyHTML = () => {
    // In a real implementation, this would generate and copy the HTML email code
    toast.success("HTML copiado al portapapeles");
  };

  const handleSendTestEmail = () => {
    // In a real implementation, this would send a test email
    toast.success("Email de prueba enviado");
  };

  const handleExportTemplate = () => {
    const templateData = {
      heroType,
      heroTitle,
      heroDescription,
      heroImage,
      heroCtaText,
      heroCtaLink,
      blogPosts: includeBlogPosts ? blogPosts : [],
      podcastEpisodes: includePodcasts ? podcastEpisodes : [],
      upsellTitle,
      upsellDescription,
      upsellImage,
      upsellCtaText,
      upsellCtaLink,
      upsellPrice
    };

    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.json';
    a.click();
    toast.success("Template exportado");
  };

  const addBlogPost = () => {
    setBlogPosts([...blogPosts, {
      title: "Nueva Entrada",
      excerpt: "Descripción de la entrada...",
      link: "https://metaforica.com/blog/nueva-entrada",
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    }]);
  };

  const removeBlogPost = (index: number) => {
    setBlogPosts(blogPosts.filter((_, i) => i !== index));
  };

  const updateBlogPost = (index: number, field: keyof BlogPostItem, value: string) => {
    const updated = [...blogPosts];
    updated[index] = { ...updated[index], [field]: value };
    setBlogPosts(updated);
  };

  const addPodcast = () => {
    setPodcastEpisodes([...podcastEpisodes, {
      title: "Nuevo Episodio",
      description: "Descripción del episodio...",
      link: "https://open.spotify.com/episode/",
      duration: "30:00"
    }]);
  };

  const removePodcast = (index: number) => {
    setPodcastEpisodes(podcastEpisodes.filter((_, i) => i !== index));
  };

  const updatePodcast = (index: number, field: keyof PodcastItem, value: string) => {
    const updated = [...podcastEpisodes];
    updated[index] = { ...updated[index], [field]: value };
    setPodcastEpisodes(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Email Marketing Templates</h2>
          <p className="text-muted-foreground">Crea y personaliza tus newsletters</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyHTML}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar HTML
          </Button>
          <Button variant="outline" onClick={handleExportTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleSendTestEmail}>
            <Send className="h-4 w-4 mr-2" />
            Enviar Prueba
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Vista Previa
          </TabsTrigger>
          <TabsTrigger value="edit">
            <Mail className="h-4 w-4 mr-2" />
            Editar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <Card className="rounded-organic">
            <CardHeader>
              <CardTitle>Vista Previa del Email</CardTitle>
              <CardDescription>
                Así se verá tu newsletter en la bandeja de entrada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-4 bg-gray-50">
                <EmailTemplate
                  heroType={heroType}
                  heroTitle={heroTitle}
                  heroDescription={heroDescription}
                  heroImage={heroImage}
                  heroCtaText={heroCtaText}
                  heroCtaLink={heroCtaLink}
                  blogPosts={includeBlogPosts ? blogPosts : []}
                  podcastEpisodes={includePodcasts ? podcastEpisodes : []}
                  upsellTitle={upsellTitle}
                  upsellDescription={upsellDescription}
                  upsellImage={upsellImage}
                  upsellCtaText={upsellCtaText}
                  upsellCtaLink={upsellCtaLink}
                  upsellPrice={upsellPrice}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Hero & Upsell */}
            <div className="space-y-6">
              {/* Hero Section */}
              <Card className="rounded-organic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                      <Mail className="h-4 w-4" />
                    </div>
                    Sección Principal (Hero)
                  </CardTitle>
                  <CardDescription>
                    El contenido destacado de tu email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tipo de Contenido</Label>
                    <Select value={heroType} onValueChange={(value: any) => setHeroType(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="book">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Nuevo Libro
                          </div>
                        </SelectItem>
                        <SelectItem value="podcast">
                          <div className="flex items-center gap-2">
                            <Headphones className="h-4 w-4" />
                            Nuevo Episodio
                          </div>
                        </SelectItem>
                        <SelectItem value="blog">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Nueva Entrada
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="heroTitle">Título</Label>
                    <Input
                      id="heroTitle"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="heroDescription">Descripción</Label>
                    <Textarea
                      id="heroDescription"
                      value={heroDescription}
                      onChange={(e) => setHeroDescription(e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="heroImage">URL de Imagen</Label>
                    <Input
                      id="heroImage"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="heroCtaText">Texto del Botón</Label>
                      <Input
                        id="heroCtaText"
                        value={heroCtaText}
                        onChange={(e) => setHeroCtaText(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="heroCtaLink">Link del Botón</Label>
                      <Input
                        id="heroCtaLink"
                        value={heroCtaLink}
                        onChange={(e) => setHeroCtaLink(e.target.value)}
                        className="mt-1"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upsell Section */}
              <Card className="rounded-organic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                      ✨
                    </div>
                    Sección de Oferta
                  </CardTitle>
                  <CardDescription>
                    Promociona un producto o servicio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="upsellTitle">Título</Label>
                    <Input
                      id="upsellTitle"
                      value={upsellTitle}
                      onChange={(e) => setUpsellTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="upsellDescription">Descripción</Label>
                    <Textarea
                      id="upsellDescription"
                      value={upsellDescription}
                      onChange={(e) => setUpsellDescription(e.target.value)}
                      className="mt-1 min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="upsellImage">URL de Imagen</Label>
                    <Input
                      id="upsellImage"
                      value={upsellImage}
                      onChange={(e) => setUpsellImage(e.target.value)}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="upsellPrice">Precio (opcional)</Label>
                      <Input
                        id="upsellPrice"
                        value={upsellPrice}
                        onChange={(e) => setUpsellPrice(e.target.value)}
                        className="mt-1"
                        placeholder="$99"
                      />
                    </div>
                    <div>
                      <Label htmlFor="upsellCtaText">Texto del Botón</Label>
                      <Input
                        id="upsellCtaText"
                        value={upsellCtaText}
                        onChange={(e) => setUpsellCtaText(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="upsellCtaLink">Link del Botón</Label>
                    <Input
                      id="upsellCtaLink"
                      value={upsellCtaLink}
                      onChange={(e) => setUpsellCtaLink(e.target.value)}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Blog & Podcast */}
            <div className="space-y-6">
              {/* Blog Posts Section */}
              <Card className="rounded-organic">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Entradas del Blog
                      </CardTitle>
                      <CardDescription>
                        Destaca tus últimas publicaciones
                      </CardDescription>
                    </div>
                    <Switch
                      checked={includeBlogPosts}
                      onCheckedChange={setIncludeBlogPosts}
                    />
                  </div>
                </CardHeader>
                {includeBlogPosts && (
                  <CardContent className="space-y-4">
                    {blogPosts.map((post, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Post {index + 1}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBlogPost(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={post.title}
                          onChange={(e) => updateBlogPost(index, 'title', e.target.value)}
                          placeholder="Título"
                        />
                        <Textarea
                          value={post.excerpt}
                          onChange={(e) => updateBlogPost(index, 'excerpt', e.target.value)}
                          placeholder="Extracto"
                          className="min-h-[60px]"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={post.link}
                            onChange={(e) => updateBlogPost(index, 'link', e.target.value)}
                            placeholder="Link"
                          />
                          <Input
                            value={post.date}
                            onChange={(e) => updateBlogPost(index, 'date', e.target.value)}
                            placeholder="Fecha"
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addBlogPost}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Post
                    </Button>
                  </CardContent>
                )}
              </Card>

              {/* Podcast Episodes Section */}
              <Card className="rounded-organic">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Headphones className="h-5 w-5 text-purple-500" />
                        Episodios de Podcast
                      </CardTitle>
                      <CardDescription>
                        Comparte tus últimos episodios
                      </CardDescription>
                    </div>
                    <Switch
                      checked={includePodcasts}
                      onCheckedChange={setIncludePodcasts}
                    />
                  </div>
                </CardHeader>
                {includePodcasts && (
                  <CardContent className="space-y-4">
                    {podcastEpisodes.map((episode, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Episodio {index + 1}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePodcast(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={episode.title}
                          onChange={(e) => updatePodcast(index, 'title', e.target.value)}
                          placeholder="Título"
                        />
                        <Textarea
                          value={episode.description}
                          onChange={(e) => updatePodcast(index, 'description', e.target.value)}
                          placeholder="Descripción"
                          className="min-h-[60px]"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={episode.link}
                            onChange={(e) => updatePodcast(index, 'link', e.target.value)}
                            placeholder="Link Spotify"
                          />
                          <Input
                            value={episode.duration}
                            onChange={(e) => updatePodcast(index, 'duration', e.target.value)}
                            placeholder="Duración"
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addPodcast}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Episodio
                    </Button>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
