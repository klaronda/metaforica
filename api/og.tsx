import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  try {
    const heroImageUrl = 'https://fdfchoshzouwguvxfnuv.supabase.co/storage/v1/object/public/site-assets/hero-image.png';
    const ctaText = 'Libera tu juicio, encuentra tu paz';

    // Convert array buffer to base64 for Edge Runtime
    const imageResponse = await fetch(heroImageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }
    const imageData = await imageResponse.arrayBuffer();
    const base64Image = btoa(
      String.fromCharCode(...new Uint8Array(imageData))
    );

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FCF6C4',
            backgroundImage: `url(data:image/png;base64,${base64Image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {/* Overlay for better text readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(252, 246, 196, 0.75)',
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 60px',
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: '#000000',
                marginBottom: 32,
                letterSpacing: '-0.03em',
              }}
            >
              Metafórica
            </div>

            {/* CTA Text */}
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: '#000000',
                marginBottom: 40,
                lineHeight: 1.1,
                maxWidth: '1000px',
                textAlign: 'center',
              }}
            >
              {ctaText}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 32,
                color: '#1F2937',
                maxWidth: '900px',
                lineHeight: 1.3,
                textAlign: 'center',
              }}
            >
              Conceptos traídos a conversaciones cotidianas para aprender cómo liberarnos del auto juicio.
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

