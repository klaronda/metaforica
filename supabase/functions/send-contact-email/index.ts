import { serve } from "https://deno.land/std@0.194.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const contactData: ContactSubmission = await req.json();

    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get Resend API key from environment
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #fdd91f, #fee568); padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 2px solid #020202; border-top: none; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #020202; margin-bottom: 5px; }
            .value { color: #333; padding: 10px; background: #fee568; border-radius: 4px; }
            .message-box { padding: 15px; background: #fee568; border-left: 4px solid #fdd91f; margin-top: 10px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #020202; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Nuevo Mensaje de Contacto</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nombre:</div>
                <div class="value">${contactData.name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${contactData.email}</div>
              </div>
              
              ${contactData.phone ? `
              <div class="field">
                <div class="label">Teléfono:</div>
                <div class="value">${contactData.phone}</div>
              </div>
              ` : ''}
              
              ${contactData.subject ? `
              <div class="field">
                <div class="label">Asunto:</div>
                <div class="value">${contactData.subject}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Mensaje:</div>
                <div class="message-box">${contactData.message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="footer">
                <p>Este mensaje fue enviado desde el formulario de contacto de soymetaforica.com</p>
                <p>Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Lima' })}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Metafórica <noreply@soymetaforica.com>',
        to: ['contact@soymetaforica.com'],
        subject: `Nuevo Mensaje de Contacto: ${contactData.subject || 'Sin asunto'}`,
        html: emailHtml,
        reply_to: contactData.email,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: errorData }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = await resendResponse.json();

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error sending contact email:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

