import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { 
  MessageCircle, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Mail, 
  Link2
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  excerpt?: string;
  imageUrl?: string;
}

export function ShareModal({ open, onOpenChange, title, url, excerpt, imageUrl }: ShareModalProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailForm, setEmailForm] = useState({
    senderName: "",
    senderEmail: "",
    recipientName: "",
    recipientEmail: "",
    message: ""
  });

  const encodedUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent(`${title}${excerpt ? ` - ${excerpt}` : ''}`);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${shareText}%20${encodedUrl}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };

  const handleLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
  };

  const handleInstagram = () => {
    // Instagram doesn't support direct link sharing via web
    // Show message and copy link instead
    handleCopyLink();
    toast.info("Instagram no permite compartir enlaces directamente. El enlace ha sido copiado al portapapeles.");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
    } catch (err) {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const handleEmailClick = () => {
    setShowEmailForm(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!emailForm.senderName || !emailForm.senderEmail || !emailForm.recipientName || !emailForm.recipientEmail) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.senderEmail)) {
      toast.error("Por favor ingresa un email válido para tu email");
      return;
    }
    if (!emailRegex.test(emailForm.recipientEmail)) {
      toast.error("Por favor ingresa un email válido para el destinatario");
      return;
    }

    setIsSubmitting(true);

    try {
      // Try to use dedicated share-email function, fall back to contact-email if it doesn't exist
      let shareFunctionExists = true;
      
      try {
        const { data, error } = await supabase.functions.invoke('send-share-email', {
          body: {
            senderName: emailForm.senderName,
            senderEmail: emailForm.senderEmail,
            recipientName: emailForm.recipientName,
            recipientEmail: emailForm.recipientEmail,
            message: emailForm.message,
            postTitle: title,
            postUrl: url,
            postExcerpt: excerpt,
            postImageUrl: imageUrl
          }
        });

        if (error) {
          // If function doesn't exist, fall back to contact-email
          const errorMessage = (error as any)?.message || '';
          if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
            shareFunctionExists = false;
          } else {
            throw error;
          }
        } else {
          // Success with share-email function
          toast.success("Email enviado exitosamente");
          setEmailForm({ senderName: "", senderEmail: "", recipientName: "", recipientEmail: "", message: "" });
          setShowEmailForm(false);
          setIsSubmitting(false);
          return;
        }
      } catch (err: any) {
        const errorMessage = err?.message || '';
        if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
          shareFunctionExists = false;
        } else {
          throw err;
        }
      }

      // Fall back to contact-email function if share-email doesn't exist
      if (!shareFunctionExists) {
        const { data, error } = await supabase.functions.invoke('send-contact-email', {
          body: {
            name: emailForm.senderName,
            email: emailForm.senderEmail,
            subject: `Compartido: ${title}`,
            message: `He compartido este artículo con ${emailForm.recipientName} (${emailForm.recipientEmail}):\n\n${title}\n${url}\n\n${emailForm.message ? `Mensaje: ${emailForm.message}` : ''}`
          }
        });

        if (error) throw error;
      }

      toast.success("Email enviado exitosamente");
      setEmailForm({ senderName: "", senderEmail: "", recipientName: "", recipientEmail: "", message: "" });
      setShowEmailForm(false);
    } catch (error) {
      console.error("Error sending share email:", error);
      toast.error("Error al enviar el email. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "text-green-600 hover:bg-green-50",
      onClick: handleWhatsApp
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600 hover:bg-blue-50",
      onClick: handleFacebook
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700 hover:bg-blue-50",
      onClick: handleLinkedIn
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-600 hover:bg-pink-50",
      onClick: handleInstagram
    },
    {
      name: "Email",
      icon: Mail,
      color: "text-[#fdd91f] hover:bg-yellow-50",
      onClick: handleEmailClick
    },
    {
      name: "Copiar Enlace",
      icon: Link2,
      color: "text-gray-600 hover:bg-gray-50",
      onClick: handleCopyLink
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Compartir</DialogTitle>
          <DialogDescription>
            {showEmailForm 
              ? "Comparte este artículo por email"
              : "Elige cómo quieres compartir este artículo"
            }
          </DialogDescription>
        </DialogHeader>

        {!showEmailForm ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.name}
                  variant="outline"
                  onClick={option.onClick}
                  className={`flex flex-col items-center gap-2 h-auto py-4 ${option.color} border-2 hover:border-[#fdd91f] transition-all`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{option.name}</span>
                </Button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="senderName">Tu nombre *</Label>
              <Input
                id="senderName"
                value={emailForm.senderName}
                onChange={(e) => setEmailForm({ ...emailForm, senderName: e.target.value })}
                placeholder="Tu nombre"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="senderEmail">Tu email *</Label>
              <Input
                id="senderEmail"
                type="email"
                value={emailForm.senderEmail}
                onChange={(e) => setEmailForm({ ...emailForm, senderEmail: e.target.value })}
                placeholder="tu@email.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="recipientName">Nombre del destinatario *</Label>
              <Input
                id="recipientName"
                value={emailForm.recipientName}
                onChange={(e) => setEmailForm({ ...emailForm, recipientName: e.target.value })}
                placeholder="Nombre del destinatario"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="recipientEmail">Email del destinatario *</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={emailForm.recipientEmail}
                onChange={(e) => setEmailForm({ ...emailForm, recipientEmail: e.target.value })}
                placeholder="destinatario@email.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message">Mensaje (opcional)</Label>
              <Textarea
                id="message"
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                placeholder="Añade un mensaje personal..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmailForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
