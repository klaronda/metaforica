import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GARequest {
  propertyId?: string;
  startDate?: string;
  endDate?: string;
  metrics?: string[];
  dimensions?: string[];
}

// Get OAuth token using service account credentials
const getAccessToken = async (): Promise<string> => {
  const serviceAccountJson = Deno.env.get("GA_SERVICE_ACCOUNT_JSON");
  if (!serviceAccountJson) {
    throw new Error("GA_SERVICE_ACCOUNT_JSON not configured in Supabase secrets");
  }

  const serviceAccount = JSON.parse(serviceAccountJson);
  const { private_key, client_email } = serviceAccount;

  // Create JWT claim
  const now = getNumericDate(new Date());
  const payload = {
    iss: client_email,
    sub: client_email,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
  };

  // Prepare private key for signing (PEM format)
  const keyData = private_key.replace(/\\n/g, "\n");
  
  // Convert PEM to ArrayBuffer for crypto.subtle
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = keyData
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  
  // Import the private key
  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  // Create and sign JWT
  const jwt = await create(
    { alg: "RS256", typ: "JWT" },
    payload,
    key
  );

  // Exchange JWT for access token
  const tokenUrl = "https://oauth2.googleapis.com/token";
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${error}`);
  }

  const tokenData = await response.json();
  return tokenData.access_token;
};

// Fetch analytics data from GA4 Data API
const fetchAnalyticsData = async (
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string,
  metrics: string[],
  dimensions: string[] = []
) => {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: metrics.map((m) => ({ name: m })),
      dimensions: dimensions.length > 0 ? dimensions.map((d) => ({ name: d })) : undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GA API error: ${response.status} ${error}`);
  }

  return await response.json();
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let requestBody: GARequest = {};
    try {
      const bodyText = await req.text();
      if (bodyText) {
        requestBody = JSON.parse(bodyText);
      }
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      // Continue with empty body - will use defaults
    }

    const { propertyId, startDate, endDate, metrics, dimensions } = requestBody;

    // Default values
    const gaPropertyId = propertyId || Deno.env.get("GA_PROPERTY_ID");
    const start = startDate || "30daysAgo";
    const end = endDate || "today";
    const defaultMetrics = metrics || ["activeUsers", "screenPageViews", "averageSessionDuration", "bounceRate"];

    console.log('Request params:', { gaPropertyId, start, end, defaultMetrics });

    if (!gaPropertyId) {
      const errorMsg = "GA_PROPERTY_ID not configured. Please add GA_PROPERTY_ID secret in Supabase Edge Functions settings.";
      console.error(errorMsg);
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if service account JSON is configured
    const serviceAccountJson = Deno.env.get("GA_SERVICE_ACCOUNT_JSON");
    if (!serviceAccountJson) {
      const errorMsg = "GA_SERVICE_ACCOUNT_JSON not configured. Please add GA_SERVICE_ACCOUNT_JSON secret in Supabase Edge Functions settings.";
      console.error(errorMsg);
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get access token
    console.log('Getting access token...');
    const accessToken = await getAccessToken();
    console.log('Access token obtained');

    // Fetch analytics data
    const data = await fetchAnalyticsData(
      gaPropertyId,
      accessToken,
      start,
      end,
      defaultMetrics,
      dimensions || []
    );

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error("GA Analytics fetch failed:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        details: error.stack 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
