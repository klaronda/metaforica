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
  Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
  // Mock data - Replace with real data from your analytics service
  const mockStats = {
    overview: {
      totalVisitors: 3247,
      visitorChange: 12.5,
      pageViews: 8932,
      pageViewChange: 8.2,
      avgSessionDuration: "3:24",
      durationChange: -5.3,
      bounceRate: 42.8,
      bounceChange: -3.2,
    },
    topPages: [
      { path: "/blog", views: 2341, title: "Blog" },
      { path: "/", views: 1876, title: "Home" },
      { path: "/podcast", views: 1234, title: "Podcast Metafórica" },
      { path: "/books", views: 987, title: "Books" },
      { path: "/blog/metaforas-diarias", views: 654, title: "Las Metáforas en la Vida Diaria" },
    ],
    topBlogPosts: [
      { title: "El Poder de las Metáforas", views: 654, avgTime: "4:32" },
      { title: "Escribir con Autenticidad", views: 543, avgTime: "5:12" },
      { title: "La Creatividad en Tiempos Difíciles", views: 432, avgTime: "3:45" },
    ],
    topPodcasts: [
      { title: "Me gusta y no sé cómo manejarlo", plays: 234, episodeNumber: 103 },
      { title: "Identidad y propósito", plays: 189, episodeNumber: 102 },
      { title: "El miedo al compromiso", plays: 156, episodeNumber: 101 },
    ],
    devices: {
      mobile: 58,
      desktop: 35,
      tablet: 7,
    },
    topLocations: [
      { country: "México", visitors: 1234, percentage: 38 },
      { country: "España", visitors: 876, percentage: 27 },
      { country: "Argentina", visitors: 543, percentage: 17 },
      { country: "Colombia", visitors: 321, percentage: 10 },
      { country: "Otros", visitors: 273, percentage: 8 },
    ],
    realTimeVisitors: 23,
  };

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
      {/* Setup Instructions Banner */}
      <Card className="rounded-organic bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Info className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg">📊 Setup Google Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Currently showing demo data. To track real visitors:
              </p>
              <ol className="text-sm space-y-1 ml-4 list-decimal">
                <li>
                  Create a free <a 
                    href="https://analytics.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Google Analytics 4 account
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>Get your Measurement ID (format: G-XXXXXXXXXX)</li>
                <li>Add it to the GoogleAnalytics component in App.tsx</li>
                <li>Wait 24-48 hours for data to populate</li>
              </ol>
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  asChild
                >
                  <a 
                    href="https://support.google.com/analytics/answer/9304153" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Setup Guide
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  asChild
                >
                  <a 
                    href="https://plausible.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Privacy-Focused Alternative (Plausible)
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Visitors */}
      <Card className="rounded-organic bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Visitantes en este momento</p>
              <p className="text-3xl font-bold text-green-700">{mockStats.realTimeVisitors}</p>
            </div>
            <div className="relative">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-ping absolute"></div>
              <div className="h-3 w-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Visitors"
          value={mockStats.overview.totalVisitors.toLocaleString()}
          change={mockStats.overview.visitorChange}
          icon={Users}
        />
        <StatCard
          title="Page Views"
          value={mockStats.overview.pageViews.toLocaleString()}
          change={mockStats.overview.pageViewChange}
          icon={Eye}
        />
        <StatCard
          title="Avg. Session Duration"
          value={mockStats.overview.avgSessionDuration}
          change={mockStats.overview.durationChange}
          icon={Clock}
        />
        <StatCard
          title="Bounce Rate"
          value={`${mockStats.overview.bounceRate}%`}
          change={mockStats.overview.bounceChange}
          icon={MousePointer}
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
              <div className="space-y-3">
                {mockStats.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-sm text-muted-foreground">{page.path}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{page.views.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                ))}
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
                <div className="space-y-3">
                  {mockStats.topBlogPosts.map((post, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm flex-1">{post.title}</p>
                        <Badge variant="secondary">{post.views}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Avg. read time: {post.avgTime}</span>
                      </div>
                    </div>
                  ))}
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
                <div className="space-y-3">
                  {mockStats.topPodcasts.map((podcast, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{podcast.title}</p>
                          <p className="text-xs text-muted-foreground">Episode #{podcast.episodeNumber}</p>
                        </div>
                        <Badge variant="secondary">{podcast.plays}</Badge>
                      </div>
                    </div>
                  ))}
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
              <div className="space-y-3">
                {mockStats.topLocations.map((location, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{location.country}</span>
                      <div className="text-right">
                        <span className="font-bold mr-2">{location.visitors.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">({location.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Mobile</span>
                    </div>
                    <span className="font-bold">{mockStats.devices.mobile}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${mockStats.devices.mobile}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span>Desktop</span>
                    </div>
                    <span className="font-bold">{mockStats.devices.desktop}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${mockStats.devices.desktop}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Tablet</span>
                    </div>
                    <span className="font-bold">{mockStats.devices.tablet}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full"
                      style={{ width: `${mockStats.devices.tablet}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <strong>Insight:</strong> {mockStats.devices.mobile}% of your visitors use mobile devices. 
                  Make sure your site is fully optimized for mobile experience!
                </p>
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
            Automated Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-white rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">✅ Great engagement on blog posts</p>
                <p className="text-sm text-muted-foreground">
                  Your blog posts have an average read time of 4+ minutes, which is excellent. 
                  Consider publishing more frequently to capitalize on this engagement.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white rounded-lg">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">⚠️ High mobile traffic</p>
                <p className="text-sm text-muted-foreground">
                  58% of visitors use mobile. Test your site on mobile devices regularly and 
                  consider mobile-first design improvements.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">💡 Podcast growth opportunity</p>
                <p className="text-sm text-muted-foreground">
                  Your podcast page is in the top 3 visited pages. Consider adding more CTAs 
                  to subscribe and highlighting new episodes on the homepage.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white rounded-lg">
              <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">📈 Bounce rate improving</p>
                <p className="text-sm text-muted-foreground">
                  Your bounce rate decreased by 3.2% this month. Keep up the engaging content 
                  and clear navigation!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
