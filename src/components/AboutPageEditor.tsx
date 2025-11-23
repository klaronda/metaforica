import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Save, Mic, BookOpen, Heart, Quote as QuoteIcon, X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { supabase } from "../lib/supabase";

interface AchievementCard {
  icon: string; // 'mic' | 'book' | 'heart' | 'quote'
  label: string;
  description: string;
}

interface AboutPageData {
  // Header Section
  sectionTitle: string;
  sectionSubtitle: string;
  
  // Profile Image
  profileImageUrl: string;
  profileImageAlt: string;
  
  // Biography
  bioTitle: string;
  bioContent: string; // Combined biography content
  
  // Values
  valuesTitle: string;
  values: string[]; // Array of value names
  
  // Achievement Cards (4 cards)
  achievements: AchievementCard[];
  
  // Philosophy Quote
  philosophyQuote: string;
  authorName: string;
  authorSubtitle: string;
}

const defaultAboutData: AboutPageData = {
  sectionTitle: "Sobre Alexandra",
  sectionSubtitle: "Una escritora peruana-americana viviendo en la costa oeste de los Estados Unidos, dedicada a explorar las profundidades del alma humana a través de las palabras.",
  
  profileImageUrl: "https://images.unsplash.com/photo-1639986162505-c9bcccfc9712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvZGNhc3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjgwMDMzMHww&ixlib=rb-4.1.0&q=80&w=1080",
  profileImageAlt: "Alexandra De la Torre - Host de Metafórica",
  
  bioTitle: "Mi Historia",
  bioContent: "Soy Alexandra De la Torre, una buscadora incansable de verdades humanas que se esconden en las experiencias más cotidianas. Mi viaje comenzó con una simple pregunta: ¿por qué vivimos como vivimos?\n\nA través del podcast Metafórica, exploro junto a mis oyentes las metáforas que dan forma a nuestras vidas. Cada conversación es una invitación a mirar más profundo, a cuestionar lo obvio y a encontrar belleza en la complejidad de ser humano.\n\nMi trabajo como escritora y coach se centra en ayudar a las personas a encontrar su voz auténtica y a vivir con mayor consciencia e intención.",
  
  valuesTitle: "Mis Valores",
  values: ["Autenticidad", "Vulnerabilidad", "Curiosidad", "Compasión", "Crecimiento"],
  
  achievements: [
    { icon: "mic", label: "103+ Episodios", description: "De conversaciones profundas" },
    { icon: "book", label: "2 Libros", description: "Publicados y en proceso" },
    { icon: "heart", label: "15K+ Oyentes", description: "Comunidad global" },
    { icon: "quote", label: "500+ Reflexiones", description: "Compartidas en redes" }
  ],
  
  philosophyQuote: "Creo profundamente en el poder transformador de las historias. Cada persona lleva dentro un universo de experiencias que, al ser compartidas con vulnerabilidad y honestidad, tienen el poder de sanar, inspirar y conectar.",
  authorName: "Alexandra De la Torre",
  authorSubtitle: "Host de Metafórica • Escritora • Coach Personal"
};

export function AboutPageEditor() {
  const [aboutData, setAboutData] = useState<AboutPageData>(defaultAboutData);
  const [hasChanges, setHasChanges] = useState(false);
  const [newValue, setNewValue] = useState("");

  const handleChange = (field: keyof AboutPageData, value: any) => {
    setAboutData({ ...aboutData, [field]: value });
    setHasChanges(true);
  };

  const handleAchievementChange = (index: number, field: keyof AchievementCard, value: string) => {
    const updatedAchievements = [...aboutData.achievements];
    updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
    setAboutData({ ...aboutData, achievements: updatedAchievements });
    setHasChanges(true);
  };

  const handleAddValue = () => {
    if (newValue.trim()) {
      setAboutData({ 
        ...aboutData, 
        values: [...aboutData.values, newValue.trim()] 
      });
      setNewValue("");
      setHasChanges(true);
    }
  };

  const handleRemoveValue = (index: number) => {
    const updatedValues = aboutData.values.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, values: updatedValues });
    setHasChanges(true);
  };

  const [sectionIds, setSectionIds] = useState<Record<string, string>>({});

  const persistSection = async (sectionType: string, content: unknown) => {
    if (!supabase) {
      throw new Error("Supabase client is not configured.");
    }

    const existingId = sectionIds[sectionType];

    if (existingId) {
      const { error } = await supabase
        .from("about_page_content")
        .update({ content })
        .eq("id", existingId);

      if (error) {
        throw error;
      }

      return existingId;
    }

    const { data, error } = await supabase
      .from("about_page_content")
      .insert([{ section_type: sectionType, content }])
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return data?.id;
  };

  const handleSave = async () => {
    try {
      const sections = [
        {
          type: "hero",
          content: {
            title: aboutData.sectionTitle,
            subtitle: aboutData.sectionSubtitle,
            profile_image_url: aboutData.profileImageUrl,
            profile_image_alt: aboutData.profileImageAlt
          }
        },
        {
          type: "biography",
          content: {
            title: aboutData.bioTitle,
            content: aboutData.bioContent
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
          }
        },
        {
          type: "values",
          content: {
            label: aboutData.valuesTitle,
            items: aboutData.values
          }
        },
        {
          type: "achievements",
          content: {
            cards: aboutData.achievements
          }
        },
        {
          type: "philosophy",
          content: {
            quote: aboutData.philosophyQuote,
            author: aboutData.authorName,
            subtitle: aboutData.authorSubtitle
          }
        }
      ];

      for (const section of sections) {
        const id = await persistSection(section.type, section.content);
        if (id) {
          setSectionIds((prev) => ({ ...prev, [section.type]: id }));
        }
      }

    toast.success("About Page saved successfully!");
    setHasChanges(false);
    } catch (error) {
      console.error("Failed to save About Page content:", error);
      toast.error("Failed to save About Page content.");
    }
  };
  const [uploadingImage, setUploadingImage] = useState(false);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'mic':
        return Mic;
      case 'book':
        return BookOpen;
      case 'heart':
        return Heart;
      case 'quote':
        return QuoteIcon;
      default:
        return Mic;
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!supabase) {
      toast.error("Supabase client is not configured.");
      return;
    }

    setUploadingImage(true);
    try {
      const filePath = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("profile-assets")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("profile-assets")
        .getPublicUrl(data.path);

      if (urlData?.publicUrl) {
        handleChange("profileImageUrl", urlData.publicUrl);
        toast.success("Profile image uploaded!");
      }
    } catch (error) {
      console.error("Profile image upload failed:", error);
      toast.error("Failed to upload profile image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from("about_page_content")
          .select("*");

        if (error) throw error;
        if (!active || !data) return;

        const hero = data.find((row) => row.section_type === "hero");
        const biography = data.find((row) => row.section_type === "biography");
        const values = data.find((row) => row.section_type === "values");
        const achievements = data.find((row) => row.section_type === "achievements");
        const philosophy = data.find((row) => row.section_type === "philosophy");

        const ids: Record<string, string> = {};
        data.forEach((row) => {
          if (row.section_type && row.id) {
            ids[row.section_type] = row.id;
          }
        });

        if (!Object.keys(ids).length) {
          setSectionIds({});
        } else {
          setSectionIds(ids);
        }

        if (hero?.content) {
          const heroContent = hero.content as {
            title?: string;
            subtitle?: string;
            profile_image_url?: string;
            profile_image_alt?: string;
          };
          setAboutData((prev) => ({
            ...prev,
            sectionTitle: heroContent.title ?? prev.sectionTitle,
            sectionSubtitle: heroContent.subtitle ?? prev.sectionSubtitle,
            profileImageUrl: heroContent.profile_image_url ?? prev.profileImageUrl,
            profileImageAlt: heroContent.profile_image_alt ?? prev.profileImageAlt
          }));
        }

        if (biography?.content) {
          const bioContent = biography.content as { title?: string; content?: string[] };
          setAboutData((prev) => ({
            ...prev,
            bioTitle: bioContent.title ?? prev.bioTitle,
            bioContent:
              bioContent.content?.join("\n\n") ?? prev.bioContent
          }));
        }

        if (values?.content) {
          const valuesContent = values.content as { label?: string; items?: string[] };
          setAboutData((prev) => ({
            ...prev,
            valuesTitle: valuesContent.label ?? prev.valuesTitle,
            values: valuesContent.items ?? prev.values
          }));
        }

        if (achievements?.content) {
          const achievementsContent = achievements.content as { cards?: AchievementCard[] };
          setAboutData((prev) => ({
            ...prev,
            achievements: achievementsContent.cards ?? prev.achievements
          }));
        }

        if (philosophy?.content) {
          const philosophyContent = philosophy.content as {
            quote?: string;
            author?: string;
            subtitle?: string;
          };
          setAboutData((prev) => ({
            ...prev,
            philosophyQuote: philosophyContent.quote ?? prev.philosophyQuote,
            authorName: philosophyContent.author ?? prev.authorName,
            authorSubtitle: philosophyContent.subtitle ?? prev.authorSubtitle
          }));
        }

        setHasChanges(false);
      } catch (error) {
        console.error("Failed to load About Page data:", error);
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, []);

  const profilePreview = useMemo(() => {
    if (!aboutData.profileImageUrl) return null;
    return (
      <div className="mt-4">
        <Label>Preview</Label>
        <div className="mt-2 w-48 h-48 rounded-lg overflow-hidden border-2 border-border">
          <img 
            src={aboutData.profileImageUrl} 
            alt={aboutData.profileImageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }, [aboutData.profileImageUrl, aboutData.profileImageAlt]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">About Page Editor</h3>
          <p className="text-muted-foreground">Edit all content from the "Sobre Mí" section</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges}
          className="bg-primary text-primary-foreground"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {hasChanges && (
        <Card className="border-2 border-amber-300 bg-amber-50">
          <CardContent className="pt-4">
            <p className="text-sm text-amber-800">
              ⚠️ You have unsaved changes. Click "Save Changes" to update the About page.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Section Header */}
      <Card className="rounded-organic">
        <CardHeader>
          <CardTitle>Section Header</CardTitle>
          <CardDescription>The main title and subtitle at the top of the About section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sectionTitle">Section Title</Label>
            <Input
              id="sectionTitle"
              value={aboutData.sectionTitle}
              onChange={(e) => handleChange('sectionTitle', e.target.value)}
              placeholder="e.g., Sobre Alexandra"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="sectionSubtitle">Section Subtitle</Label>
            <Textarea
              id="sectionSubtitle"
              value={aboutData.sectionSubtitle}
              onChange={(e) => handleChange('sectionSubtitle', e.target.value)}
              placeholder="Brief introduction..."
              className="mt-1 min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Image */}
      <Card className="rounded-organic">
        <CardHeader>
          <CardTitle>Profile Image</CardTitle>
          <CardDescription>Your main profile photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="profileImageUrl">Image URL</Label>
            <Input
              id="profileImageUrl"
              value={aboutData.profileImageUrl}
              onChange={(e) => handleChange('profileImageUrl', e.target.value)}
              placeholder="https://..."
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tip: Upload to Supabase Storage or use an external URL
            </p>
          </div>
          <div>
            <Label htmlFor="profileImageAlt">Image Alt Text</Label>
            <Input
              id="profileImageAlt"
              value={aboutData.profileImageAlt}
              onChange={(e) => handleChange('profileImageAlt', e.target.value)}
              placeholder="Description for accessibility"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="profileImageUpload">Upload from device</Label>
            <input
              id="profileImageUpload"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="mt-1 block w-full text-sm text-muted-foreground"
            />
            {uploadingImage && (
              <p className="text-xs text-amber-600 mt-1">Uploading…</p>
            )}
              </div>
          {profilePreview}
        </CardContent>
      </Card>

      {/* Biography Section */}
      <Card className="rounded-organic">
        <CardHeader>
          <CardTitle>Biography - "Mi Historia"</CardTitle>
          <CardDescription>Your personal story (3 paragraphs)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bioTitle">Bio Section Title</Label>
            <Input
              id="bioTitle"
              value={aboutData.bioTitle}
              onChange={(e) => handleChange('bioTitle', e.target.value)}
              placeholder="e.g., Mi Historia"
              className="mt-1"
            />
          </div>
          <Separator />
          <div>
            <Label htmlFor="bioContent">Biography Content</Label>
            <Textarea
              id="bioContent"
              value={aboutData.bioContent}
              onChange={(e) => handleChange('bioContent', e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Values Section */}
      <Card className="rounded-organic">
        <CardHeader>
          <CardTitle>Core Values</CardTitle>
          <CardDescription>Your personal values displayed as badges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="valuesTitle">Values Section Title</Label>
            <Input
              id="valuesTitle"
              value={aboutData.valuesTitle}
              onChange={(e) => handleChange('valuesTitle', e.target.value)}
              placeholder="e.g., Mis Valores"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Current Values</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {aboutData.values.map((value, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-amber-100 text-amber-800 flex items-center gap-2"
                >
                  {value}
                  <button
                    onClick={() => handleRemoveValue(index)}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
              placeholder="Add a new value..."
              className="flex-1"
            />
            <Button onClick={handleAddValue} variant="outline">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Cards (4 Cards) */}
      <Card className="rounded-organic">
        <CardHeader>
          <CardTitle>Achievement Cards (4 Cards)</CardTitle>
          <CardDescription>The statistics and achievements displayed below your bio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {aboutData.achievements.map((achievement, index) => {
            const IconComponent = getIconComponent(achievement.icon);
            return (
              <div key={index} className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-semibold">Card {index + 1}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`achievement-icon-${index}`}>Icon</Label>
                    <select
                      id={`achievement-icon-${index}`}
                      value={achievement.icon}
                      onChange={(e) => handleAchievementChange(index, 'icon', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="mic">🎤 Microphone (Podcast)</option>
                      <option value="book">📚 Book</option>
                      <option value="heart">❤️ Heart (Community)</option>
                      <option value="quote">💬 Quote</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`achievement-label-${index}`}>Label (Main Text)</Label>
                    <Input
                      id={`achievement-label-${index}`}
                      value={achievement.label}
                      onChange={(e) => handleAchievementChange(index, 'label', e.target.value)}
                      placeholder="e.g., 103+ Episodios"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`achievement-description-${index}`}>Description</Label>
                    <Input
                      id={`achievement-description-${index}`}
                      value={achievement.description}
                      onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                      placeholder="e.g., De conversaciones profundas"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Philosophy/Quote Section */}
      <Card className="rounded-organic bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle>Philosophy Quote</CardTitle>
          <CardDescription>The inspirational quote at the bottom of the About section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="philosophyQuote">Quote Text</Label>
            <Textarea
              id="philosophyQuote"
              value={aboutData.philosophyQuote}
              onChange={(e) => handleChange('philosophyQuote', e.target.value)}
              className="mt-1 min-h-[120px]"
              placeholder="Your personal philosophy or mission statement..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="authorName">Author Name</Label>
              <Input
                id="authorName"
                value={aboutData.authorName}
                onChange={(e) => handleChange('authorName', e.target.value)}
                placeholder="e.g., Alexandra De la Torre"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="authorSubtitle">Author Subtitle</Label>
              <Input
                id="authorSubtitle"
                value={aboutData.authorSubtitle}
                onChange={(e) => handleChange('authorSubtitle', e.target.value)}
                placeholder="e.g., Host de Metafórica • Escritora"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button at Bottom */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSave}
          disabled={!hasChanges}
          size="lg"
          className="bg-primary text-primary-foreground"
        >
          <Save className="h-5 w-5 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}