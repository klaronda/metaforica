import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Eye, 
  TrendingUp, 
  Users, 
  Clock, 
  MousePointer, 
  FileText, 
  Headphones,
  BookOpen,
  ExternalLink,
  BarChart3,
  Globe,
  Smartphone,
  Monitor,
  ArrowUp,
  ArrowDown,
  Info,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

/**
 * Analytics Dashboard Component
 * 
 * This shows analytics data for your website. Currently displays:
 * - Placeholder/demo data for development
 * - Instructions for connecting to Google Analytics
 * 
 * To get REAL data:
 * 1. Set up Google Analytics 4 (see GoogleAnalytics.tsx)
 * 2. Use Google Analytics Data API to fetch real metrics
 * 3. OR use a service like Plausible Analytics (privacy-focused alternative)
 * 4. OR connect to Supabase to track custom events
 */
export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // Fetch analytics data from Edge Function
  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('fetch-ga-analytics', {
        body: {
          startDate: '30daysAgo',
          endDate: 'today',
          metrics: ['activeUsers', 'screenPageViews', 'averageSessionDuration', 'bounceRate'],
        },
      });

      console.log('Edge Function response:', response);

      const { data, error } = response;

      if (error) {
        console.error('Edge Function error:', error);
        
        // Try to extract error message from the error object
        let errorMessage = error.message || 'Edge Function returned an error';
        let errorDetails = '';
        
        // Try to fetch the actual error response body
        if (error.context && error.context.response) {
          try {
            const responseText = await error.context.response.clone().text();
            console.log('Error response body:', responseText);
            const parsed = JSON.parse(responseText);
            if (parsed.error) {
              errorMessage = parsed.error;
              if (parsed.details) {
                errorDetails = parsed.details;
              }
            }
          } catch (e) {
            console.error('Failed to parse error response:', e);
          }
        }
        
        // Also check if data contains error (sometimes error responses still have data)
        if (data && data.error) {
          errorMessage = data.error;
          if (data.details) {
            errorDetails = data.details;
          }
        }
        
        // Check for Google Analytics API not enabled error
        if (errorMessage.includes('Google Analytics Data API has not been used') || 
            errorMessage.includes('SERVICE_DISABLED') ||
            errorMessage.includes('analyticsdata.googleapis.com')) {
          errorMessage = 'Google Analytics Data API is not enabled in your Google Cloud project.';
          errorDetails = 'Please enable it here: https://console.developers.google.com/apis/api/analyticsdata.googleapis.com/overview?project=388768196566\n\nAfter enabling, wait a few minutes for the change to propagate.';
        }
        
        const fullError = errorDetails ? `${errorMessage}\n\n${errorDetails}` : errorMessage;
        throw new Error(fullError);
      }

      // Check if data contains error information (500 response with error in body)
      if (data && data.error) {
        console.error('Edge Function returned error in data:', data);
        const errorMessage = data.error + (data.details ? `\n\nDetails: ${data.details}` : '');
        throw new Error(errorMessage);
      }

      if (data && data.success) {
        setAnalyticsData(data.data);
        setLastFetch(new Date());
        toast.success('Analytics data loaded successfully');
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Failed to fetch analytics data - unexpected response format');
      }
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      const errorMessage = error.message || error.toString() || 'Unknown error occurred';
      toast.error(`Failed to load analytics: ${errorMessage}`);
      
      // Log full error for debugging
      console.error('Full error object:', error);
      if (error.response || error.data) {
        console.error('Full error details:', { response: error.response, data: error.data });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Parse GA4 response to extract metrics
  const parseMetrics = (data: any) => {
    if (!data || !data.rows || data.rows.length === 0) {
      return {
        activeUsers: 0,
        screenPageViews: 0,
        averageSessionDuration: 0,
        bounceRate: 0,
      };
    }

    const row = data.rows[0];
    const metrics: any = {};
    
    row.metricValues?.forEach((mv: any, index: number) => {
      const metricName = data.metricHeaders[index]?.name;
      if (metricName === 'activeUsers') {
        metrics.activeUsers = parseInt(mv.value || '0');
      } else if (metricName === 'screenPageViews') {
        metrics.screenPageViews = parseInt(mv.value || '0');
      } else if (metricName === 'averageSessionDuration') {
        // Convert seconds to MM:SS format
        const seconds = parseFloat(mv.value || '0');
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        metrics.averageSessionDuration = `${mins}:${secs.toString().padStart(2, '0')}`;
      } else if (metricName === 'bounceRate') {
        metrics.bounceRate = parseFloat(mv.value || '0');
      }
    });

    return metrics;
  };

  const metrics = analyticsData ? parseMetrics(analyticsData) : null;

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    description 
  }: { 
    title: string; 
    value: string | number; 
    change?: number; 
    icon: any; 
    description?: string;
  }) => (
    <Card className="rounded-organic">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-sm mt-1">
            {change >= 0 ? (
              <>
                <ArrowUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+{change}%</span>
              </>
            ) : (
              <>
                <ArrowDown className="h-3 w-3 text-red-600" />
                <span className="text-red-600">{change}%</span>
              </>
            )}
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Analytics Status Banner */}
      <Card className="rounded-organic bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Info className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg">✅ Google Analytics Connected</h3>
              <p className="text-sm text-muted-foreground">
                Your site is tracking visitors with Google Analytics (G-LFQ0BL4777). 
                Real-time data is available in your GA dashboard. To view detailed analytics in this CMS, 
                connect the Google Analytics Data API.
              </p>
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  asChild
                >
                  <a 
                    href="https://analytics.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Open Google Analytics Dashboard
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  asChild
                >
                  <a 
                    href="https://developers.google.com/analytics/devguides/reporting/data/v1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Learn About Data API
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Visitors & Refresh */}
      <Card className="rounded-organic bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users (Last 30 Days)</p>
              <p className="text-3xl font-bold text-green-700">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin inline" />
                ) : metrics ? (
                  metrics.activeUsers.toLocaleString()
                ) : (
                  "—"
                )}
              </p>
              {lastFetch && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {lastFetch.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchAnalytics}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <a 
                  href="https://analytics.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  GA Dashboard
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Visitors"
          value={isLoading ? "..." : metrics ? metrics.activeUsers.toLocaleString() : "—"}
          icon={Users}
          description={metrics ? "Last 30 days" : "Connect Google Analytics Data API"}
        />
        <StatCard
          title="Page Views"
          value={isLoading ? "..." : metrics ? metrics.screenPageViews.toLocaleString() : "—"}
          icon={Eye}
          description={metrics ? "Last 30 days" : "Data will appear here once API is connected"}
        />
        <StatCard
          title="Avg. Session Duration"
          value={isLoading ? "..." : metrics ? metrics.averageSessionDuration : "—"}
          icon={Clock}
          description={metrics ? "Average time on site" : "View in Google Analytics dashboard"}
        />
        <StatCard
          title="Bounce Rate"
          value={isLoading ? "..." : metrics ? `${metrics.bounceRate.toFixed(1)}%` : "—"}
          icon={MousePointer}
          description={metrics ? "Single-page sessions" : "Available in GA reports"}
        />
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        {/* Top Pages */}
        <TabsContent value="pages" className="space-y-4">
          <Card className="rounded-organic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Pages
              </CardTitle>
              <CardDescription>Most visited pages this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Page analytics will appear here</p>
                <p className="text-sm">Connect Google Analytics Data API to view real data</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  asChild
                >
                  <a 
                    href="https://analytics.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Google Analytics
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Performance */}
        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Blog Posts */}
            <Card className="rounded-organic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Top Blog Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Blog post analytics coming soon</p>
                </div>
              </CardContent>
            </Card>

            {/* Top Podcast Episodes */}
            <Card className="rounded-organic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Top Podcast Episodes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Headphones className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Podcast analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audience */}
        <TabsContent value="audience" className="space-y-4">
          <Card className="rounded-organic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Top Locations
              </CardTitle>
              <CardDescription>Where your visitors are from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Geographic data will appear here</p>
                <p className="text-sm">Available in Google Analytics reports</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices */}
        <TabsContent value="devices" className="space-y-4">
          <Card className="rounded-organic">
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>How visitors access your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Device analytics will appear here</p>
                <p className="text-sm">View device breakdown in Google Analytics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights & Recommendations */}
      <Card className="rounded-organic bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            General Recommendations & Best Practices
          </CardTitle>
          <CardDescription>Actionable insights to improve your website performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-white rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">✅ Optimize for Mobile</p>
                <p className="text-sm text-muted-foreground">
                  Most web traffic comes from mobile devices. Ensure your site is fully responsive, 
                  images are optimized, and touch targets are large enough. Test on real devices regularly.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">💡 Improve Page Load Speed</p>
                <p className="text-sm text-muted-foreground">
                  Fast-loading pages improve user experience and SEO. Optimize images, enable caching, 
                  minimize JavaScript, and consider using a CDN. Aim for under 3 seconds load time.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white rounded-lg">
              <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">📝 Create Engaging Content Regularly</p>
                <p className="text-sm text-muted-foreground">
                  Consistent, high-quality content keeps visitors coming back. Publish blog posts, 
                  podcast episodes, and stories on a regular schedule. Use analytics to see what 
                  content resonates most with your audience.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white rounded-lg">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">🔍 Enhance SEO</p>
                <p className="text-sm text-muted-foreground">
                  Use descriptive titles, meta descriptions, and alt text for images. Create internal 
                  links between related content. Ensure your site structure is clear and URLs are 
                  readable. Submit your sitemap to search engines.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white rounded-lg">
              <div className="h-2 w-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">🎯 Add Clear Call-to-Actions</p>
                <p className="text-sm text-muted-foreground">
                  Guide visitors to take action. Add prominent subscribe buttons for your podcast, 
                  newsletter signup forms, and links to your social media. Make it easy for visitors 
                  to engage with your content.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white rounded-lg">
              <div className="h-2 w-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">📊 Monitor Analytics Regularly</p>
                <p className="text-sm text-muted-foreground">
                  Check your Google Analytics dashboard weekly to understand visitor behavior. 
                  Identify which pages perform best, where traffic comes from, and what content 
                  drives engagement. Use this data to inform your content strategy.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
