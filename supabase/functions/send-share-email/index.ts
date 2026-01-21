import { serve } from "https://deno.land/std@0.194.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShareEmailData {
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message?: string;
  postTitle: string;
  postUrl: string;
  postExcerpt?: string;
  postImageUrl?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const shareData: ShareEmailData = await req.json();

    // Validate required fields
    if (!shareData.senderName || !shareData.senderEmail || !shareData.recipientName || !shareData.recipientEmail || !shareData.postTitle || !shareData.postUrl) {
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

    const senderName = shareData.senderName;
    const recipientName = shareData.recipientName;
    // Capitalize first letter of recipient name
    const recipientNameCapitalized = recipientName.charAt(0).toUpperCase() + recipientName.slice(1);
    
    const personalMessage = shareData.message ? `<div style="padding: 15px; background: #fee568; border-left: 4px solid #fdd91f; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-style: italic; color: #333;">"${shareData.message.replace(/\n/g, '<br>')}"</p>
    </div>` : '';

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
            .post-card { background: #fee568; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #020202; }
            .post-image { width: 100%; max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; border: 2px solid #020202; display: block; }
            .post-title { font-size: 20px; font-weight: bold; color: #020202; margin-bottom: 10px; }
            .post-excerpt { color: #333; margin-bottom: 15px; }
            .post-link { display: inline-block; background: #020202; color: #fdd91f; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #020202; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #000; font-size: 24px;">${recipientNameCapitalized}, ${senderName} te compartió un artículo</h1>
            </div>
            <div class="content">
              <p style="margin: 0 0 20px; color: #333;">Hola ${recipientNameCapitalized},</p>
              <p style="margin: 0 0 20px; color: #333;">${senderName} pensó que te gustaría este artículo escrito por Metafórica:</p>
              
              ${personalMessage}
              
              <div class="post-card">
                ${shareData.postImageUrl ? `<img src="${shareData.postImageUrl}" alt="${shareData.postTitle}" class="post-image" style="width: 100%; max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; border: 2px solid #020202; display: block;" />` : ''}
                <div class="post-title">${shareData.postTitle}</div>
                ${shareData.postExcerpt ? `<div class="post-excerpt">${shareData.postExcerpt}</div>` : ''}
                <a href="${shareData.postUrl}" style="display: inline-block; background: #020202 !important; color: #fdd91f !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px;">Leer artículo →</a>
              </div>
              
              <p style="margin: 20px 0 0; color: #666; font-size: 14px;">Este email fue enviado desde soymetaforica.com</p>
              
              <div class="footer">
                <p>Metafórica - Explorando el lenguaje del alma</p>
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
        from: `${senderName} via Metafórica <noreply@soymetaforica.com>`,
        to: [shareData.recipientEmail],
        subject: `${recipientNameCapitalized}, ${senderName} te compartió: ${shareData.postTitle}`,
        html: emailHtml,
        reply_to: shareData.senderEmail, // Allow recipient to reply to sender
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
    console.error('Error sending share email:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
