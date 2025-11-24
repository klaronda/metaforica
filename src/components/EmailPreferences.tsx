import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner@2.0.3";
import { Mail, CheckCircle, Settings, FileText, BookOpen, Mic, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";

interface EmailPreferencesProps {
  onBack?: () => void;
}

export function EmailPreferences({ onBack }: EmailPreferencesProps) {
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    blogPosts: true,
    books: true,
    podcast: true,
    workshops: true,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      // Lookup email in database
      const { data, error } = await supabase
        .from("email_subscribers")
        .select("*")
        .eq("email", normalizedEmail)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      // If email exists, load preferences
      if (data) {
        setPreferences({
          blogPosts: data.pref_blog_posts ?? true,
          books: data.pref_books ?? true,
          podcast: data.pref_podcast ?? true,
          workshops: data.pref_workshops ?? true,
        });
      } else {
        // Email doesn't exist - create new record with all preferences false
        // (user is opting out before subscribing)
        const { error: insertError } = await supabase
          .from("email_subscribers")
          .insert({
            email: normalizedEmail,
            is_active: false,
            pref_blog_posts: false,
            pref_books: false,
            pref_podcast: false,
            pref_workshops: false,
          });

        if (insertError) throw insertError;

        setPreferences({
          blogPosts: false,
          books: false,
          podcast: false,
          workshops: false,
        });
      }

      setIsLoading(false);
      setIsEmailVerified(true);
      toast.success("Email verificado");
    } catch (error: any) {
      console.error("Error verifying email:", error);
      toast.error("Error al verificar el email. Por favor intenta de nuevo.");
      setIsLoading(false);
    }
  };

  const handleUpdatePreferences = async () => {
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      // Update preferences in database
      const { error } = await supabase
        .from("email_subscribers")
        .upsert({
          email: normalizedEmail,
          is_active: preferences.blogPosts || preferences.books || preferences.podcast || preferences.workshops,
          pref_blog_posts: preferences.blogPosts,
          pref_books: preferences.books,
          pref_podcast: preferences.podcast,
          pref_workshops: preferences.workshops,
        }, {
          onConflict: 'email'
        });

      if (error) throw error;

      setIsLoading(false);
      setShowConfirmation(true);

      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);

      toast.success("Preferencias actualizadas exitosamente");
    } catch (error: any) {
      console.error("Error updating preferences:", error);
      toast.error("Error al actualizar las preferencias. Por favor intenta de nuevo.");
      setIsLoading(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    const allUnchecked = {
      blogPosts: false,
      books: false,
      podcast: false,
      workshops: false,
    };
    setPreferences(allUnchecked);
    
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      // Update database: set is_active to false and all preferences to false
      const { error } = await supabase
        .from("email_subscribers")
        .upsert({
          email: normalizedEmail,
          is_active: false,
          pref_blog_posts: false,
          pref_books: false,
          pref_podcast: false,
          pref_workshops: false,
        }, {
          onConflict: 'email'
        });

      if (error) throw error;
      
      setIsLoading(false);
      setShowConfirmation(true);
      
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
      
      toast.success("Te has desuscrito de todos los correos");
    } catch (error: any) {
      console.error("Error unsubscribing:", error);
      toast.error("Error al desuscribirte. Por favor intenta de nuevo.");
      setIsLoading(false);
    }
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allUnsubscribed = !preferences.blogPosts && !preferences.books && !preferences.podcast && !preferences.workshops;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full mb-4 shadow-lg">
            <Settings className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-4xl font-black text-black mb-2">
            Preferencias de Email
          </h1>
          <p className="text-gray-600">
            Gestiona tus suscripciones a los correos de Metafórica
          </p>
        </div>

        {!isEmailVerified ? (
          /* Email Verification Form */
          <Card className="border-2 border-yellow-400 shadow-xl bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl text-black">Verifica tu Email</CardTitle>
              <CardDescription className="text-gray-600">
                Ingresa tu dirección de email para gestionar tus preferencias de suscripción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black">
                    Dirección de Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-yellow-50 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-yellow-400 transition-all duration-200 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Verificando..." : "Continuar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Preferences Management */
          <Card className="border-2 border-yellow-400 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-black flex items-center gap-2">
                <Mail className="h-6 w-6 text-yellow-600" />
                Gestiona tus Suscripciones
              </CardTitle>
              <CardDescription className="text-gray-600">
                {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {showConfirmation && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-green-900">
                      ¡Preferencias actualizadas exitosamente!
                    </p>
                    <p className="text-sm text-green-700">
                      Tus cambios han sido guardados.
                    </p>
                  </div>
                </div>
              )}

              {allUnsubscribed && (
                <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4">
                  <p className="text-amber-900">
                    Actualmente no estás suscrito a ningún tipo de correo. 
                    ¡Te extrañaremos! Puedes volver a suscribirte en cualquier momento.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-gray-700">
                  Selecciona los tipos de correos que deseas recibir:
                </p>

                {/* Blog Posts */}
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 hover:border-yellow-400 transition-colors">
                  <Checkbox
                    id="blogPosts"
                    checked={preferences.blogPosts}
                    onCheckedChange={() => togglePreference("blogPosts")}
                    className="mt-1"
                  />
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex-shrink-0">
                    <FileText className="h-5 w-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="blogPosts"
                      className="cursor-pointer text-black"
                    >
                      Nuevos Escritos del Blog
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Recibe notificaciones cuando publique nuevas reflexiones y artículos
                    </p>
                  </div>
                </div>

                {/* Books */}
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 hover:border-yellow-400 transition-colors">
                  <Checkbox
                    id="books"
                    checked={preferences.books}
                    onCheckedChange={() => togglePreference("books")}
                    className="mt-1"
                  />
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="books"
                      className="cursor-pointer text-black"
                    >
                      Nuevos Libros
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Entérate cuando publique nuevos libros o ediciones especiales
                    </p>
                  </div>
                </div>

                {/* Podcast */}
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 hover:border-yellow-400 transition-colors">
                  <Checkbox
                    id="podcast"
                    checked={preferences.podcast}
                    onCheckedChange={() => togglePreference("podcast")}
                    className="mt-1"
                  />
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex-shrink-0">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="podcast"
                      className="cursor-pointer text-black"
                    >
                      Nuevos Episodios del Podcast
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Recibe actualizaciones cuando lance nuevos episodios de Metafórica
                    </p>
                  </div>
                </div>

                {/* Workshops */}
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 hover:border-yellow-400 transition-colors">
                  <Checkbox
                    id="workshops"
                    checked={preferences.workshops}
                    onCheckedChange={() => togglePreference("workshops")}
                    className="mt-1"
                  />
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex-shrink-0">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="workshops"
                      className="cursor-pointer text-black"
                    >
                      Talleres y Eventos
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Información sobre talleres, coaching y eventos especiales
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-200">
                <Button
                  onClick={handleUpdatePreferences}
                  className="flex-1 bg-black hover:bg-gray-800 text-yellow-400 transition-all duration-200 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar Preferencias"}
                </Button>
                <Button
                  onClick={handleUnsubscribeAll}
                  variant="outline"
                  className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                  disabled={isLoading}
                >
                  Desuscribirse de Todo
                </Button>
              </div>

              {/* Change Email */}
              <div className="text-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsEmailVerified(false);
                    setEmail("");
                  }}
                  className="text-sm text-gray-600 hover:text-yellow-600 transition-colors underline"
                >
                  ¿Usar un email diferente?
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to home */}
        {onBack && (
          <div className="text-center mt-8">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-yellow-600 transition-colors font-semibold"
            >
              ← Volver al Sitio Web
            </button>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
          <p>
            Respetamos tu privacidad y nunca compartiremos tu información con terceros.
          </p>
          <p>
            Puedes actualizar tus preferencias en cualquier momento haciendo clic en el enlace 
            "Gestionar Preferencias" en cualquiera de nuestros correos.
          </p>
        </div>
      </div>
    </div>
  );
}