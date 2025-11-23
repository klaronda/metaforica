import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { Mail, CheckCircle } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactReason: "",
    business: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.contactReason || !formData.email || !formData.message) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission (in production, this would send to a backend/API)
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Contact form submitted:", formData);
    
    setIsSubmitting(false);
    setShowConfirmation(true);

    // Reset form after showing confirmation
    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        contactReason: "",
        business: "",
        phone: "",
        email: "",
        message: "",
      });
      setShowConfirmation(false);
      onOpenChange(false);
    }, 2500);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setShowConfirmation(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="h-6 w-6 text-yellow-600" />
                <DialogTitle className="text-2xl text-black">Contacto</DialogTitle>
              </div>
              <DialogDescription className="text-gray-700 text-center sm:text-left">
                Completa el formulario y nos pondremos en contacto contigo pronto.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-black">
                  Nombre <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-white border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-black">
                  Apellido <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-white border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Contact Reason */}
              <div className="space-y-2">
                <Label htmlFor="contactReason" className="text-black">
                  Razón de Contacto <span className="text-red-600">*</span>
                </Label>
                <Select 
                  value={formData.contactReason}
                  onValueChange={(value) => handleInputChange("contactReason", value)}
                  required
                >
                  <SelectTrigger className="bg-white border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-yellow-300">
                    <SelectItem value="podcast">Podcast</SelectItem>
                    <SelectItem value="libro">Libro</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Business (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="business" className="text-black">
                  Empresa (opcional)
                </Label>
                <Input
                  id="business"
                  value={formData.business}
                  onChange={(e) => handleInputChange("business", e.target.value)}
                  className="bg-white border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-black">
                  Teléfono <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-white border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">
                  Email <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-black">
                  Mensaje <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="bg-white border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 min-h-[100px]"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-yellow-400 transition-all duration-200 shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </Button>
            </form>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 animate-bounce" />
            <DialogTitle className="text-2xl text-black">¡Mensaje Enviado!</DialogTitle>
            <p className="text-gray-700">
              Gracias por contactarnos. Te responderemos pronto.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}