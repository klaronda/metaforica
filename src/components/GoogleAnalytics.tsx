import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  measurementId?: string;
  currentPage?: string;
}

/**
 * Google Analytics Component
 * 
 * Setup Instructions:
 * 1. Go to https://analytics.google.com/
 * 2. Create a GA4 property for your website
 * 3. Get your Measurement ID (looks like G-XXXXXXXXXX)
 * 4. Replace 'G-XXXXXXXXXX' in App.tsx with your actual ID
 * 
 * Privacy Note:
 * - GA4 tracks anonymous users by default
 * - No PII (Personally Identifiable Information) is collected
 * - Compliant with privacy regulations when configured properly
 */
export function GoogleAnalytics({ measurementId = 'G-XXXXXXXXXX', currentPage = 'home' }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Only load GA if we have a real measurement ID
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
      console.log('📊 Google Analytics: Add your Measurement ID to enable tracking');
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src*="${measurementId}"]`);
    if (existingScript) {
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      anonymize_ip: true, // Privacy: Anonymize IP addresses
      send_page_view: true
    });

    return () => {
      // Cleanup: remove script when component unmounts
      const scriptElement = document.querySelector(`script[src*="${measurementId}"]`);
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [measurementId]);

  // Track page views when currentPage changes
  useEffect(() => {
    if (measurementId && measurementId !== 'G-XXXXXXXXXX' && window.gtag) {
      window.gtag('config', measurementId, {
        page_path: `/${currentPage}`,
        page_title: currentPage,
      });
    }
  }, [currentPage, measurementId]);

  return null; // This component doesn't render anything
}