import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  RefreshCw, 
  Youtube, 
  Edit3, 
  Eye, 
  EyeOff, 
  Star,
  StarOff,
  Calendar,
  Clock,
  Search,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Save,
  X,
  Play,
  CheckCircle,
  AlertCircle,
  Music
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { supabase } from "../lib/supabase";

interface PodcastEpisode {
  id: string;
  spotifyId: string;
  title: string;
  description: string;
  publishDate: string;
  duration: string; // e.g., "45:32"
  spotifyUrl: string;
  thumbnailUrl: string;
  
  // Enhanced fields (editable in CMS)
  youtubeUrl?: string;
  customShowNotes?: string;
  isFeatured: boolean;
  isVisible: boolean;
  transcriptUrl?: string;
  additionalLinks?: { title: string; url: string }[];
  seoDescription?: string;
  seoKeywords?: string;
}

export function PodcastManager() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "featured" | "visible" | "hidden">("all");
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load episodes from Supabase on mount
  useEffect(() => {
    loadEpisodes();
  }, []);

  const loadEpisodes = async () => {
    setIsLoadingEpisodes(true);
    try {
      const { data, error } = await supabase
        .from('podcast_episodes')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedEpisodes: PodcastEpisode[] = data.map((episode) => ({
          id: episode.id,
          spotifyId: episode.spotify_id || '',
          title: episode.title,
          description: episode.description || '',
          publishDate: episode.publish_date,
          duration: episode.duration || '00:00',
          spotifyUrl: episode.spotify_url || '',
          thumbnailUrl: episode.thumbnail_url || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400',
          youtubeUrl: episode.youtube_url || '',
          customShowNotes: episode.custom_show_notes || '',
          isFeatured: episode.is_featured || false,
          isVisible: episode.is_visible !== false,
          transcriptUrl: episode.transcript_url || '',
          seoDescription: episode.seo_description || '',
          seoKeywords: episode.seo_keywords || '',
        }));
        setEpisodes(mappedEpisodes);
      }
    } catch (error) {
      console.error('Error loading episodes:', error);
      toast.error('Failed to load episodes from database');
    } finally {
      setIsLoadingEpisodes(false);
    }
  };
  
  // Sync state
  const [lastSync, setLastSync] = useState<Date>(new Date("2024-11-12T10:30:00"));
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(
        'https://fdfchoshzouwguvxfnuv.supabase.co/functions/v1/fetch-spotify-episodes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      const result = await response.json();
      setLastSync(new Date());
      toast.success(`Synced ${result.synced || 0} episodes from Spotify!`);
      
      // Reload episodes after successful sync
      await loadEpisodes();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync with Spotify. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleFeatured = async (episodeId: string) => {
    const episode = episodes.find(ep => ep.id === episodeId);
    if (!episode) return;

    const newFeaturedState = !episode.isFeatured;
    
    try {
      const { error } = await supabase
        .from('podcast_episodes')
        .update({ is_featured: newFeaturedState })
        .eq('id', episodeId);

      if (error) throw error;

      setEpisodes(episodes.map(ep => 
        ep.id === episodeId ? { ...ep, isFeatured: newFeaturedState } : ep
      ));
      toast.success(newFeaturedState ? "Marked as featured" : "Removed from featured");
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const handleToggleVisible = async (episodeId: string) => {
    const episode = episodes.find(ep => ep.id === episodeId);
    if (!episode) return;

    const newVisibleState = !episode.isVisible;
    
    try {
      const { error } = await supabase
        .from('podcast_episodes')
        .update({ is_visible: newVisibleState })
        .eq('id', episodeId);

      if (error) throw error;

      setEpisodes(episodes.map(ep => 
        ep.id === episodeId ? { ...ep, isVisible: newVisibleState } : ep
      ));
      toast.success(newVisibleState ? "Episode visible" : "Episode hidden");
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const handleEditEpisode = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
    setIsEditing(true);
  };

  const handleSaveEpisode = async () => {
    if (!selectedEpisode) return;

    try {
      const { error } = await supabase
        .from('podcast_episodes')
        .update({
          youtube_url: selectedEpisode.youtubeUrl || null,
          custom_show_notes: selectedEpisode.customShowNotes || null,
          transcript_url: selectedEpisode.transcriptUrl || null,
          seo_description: selectedEpisode.seoDescription || null,
          seo_keywords: selectedEpisode.seoKeywords || null,
          is_featured: selectedEpisode.isFeatured,
          is_visible: selectedEpisode.isVisible,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedEpisode.id);

      if (error) throw error;

      setEpisodes(episodes.map(ep => 
        ep.id === selectedEpisode.id ? selectedEpisode : ep
      ));
      setIsEditing(false);
      setSelectedEpisode(null);
      toast.success("Episode updated successfully!");
    } catch (error) {
      console.error('Error saving episode:', error);
      toast.error('Failed to save episode');
    }
  };

  const handleUpdateField = (field: keyof PodcastEpisode, value: any) => {
    if (selectedEpisode) {
      setSelectedEpisode({ ...selectedEpisode, [field]: value });
    }
  };

  const filteredEpisodes = episodes
    .filter(ep => {
      const matchesSearch = ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ep.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        filterStatus === "all" ? true :
        filterStatus === "featured" ? ep.isFeatured :
        filterStatus === "visible" ? ep.isVisible :
        !ep.isVisible;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Sync Controls */}
      <Card className="rounded-organic border-2 border-green-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-green-500" />
                Spotify Sync
              </CardTitle>
              <CardDescription>
                Last synced: {lastSync.toLocaleString('es-ES')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                  id="auto-sync"
                />
                <Label htmlFor="auto-sync" className="text-sm">Auto-sync daily</Label>
              </div>
              <Button 
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold">{episodes.length}</div>
              <div className="text-sm text-muted-foreground">Total Episodes</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold">{episodes.filter(e => e.isFeatured).length}</div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold">{episodes.filter(e => e.youtubeUrl).length}</div>
              <div className="text-sm text-muted-foreground">With YouTube</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="rounded-organic">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search episodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Episodes</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="visible">Visible Only</SelectItem>
                <SelectItem value="hidden">Hidden Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Episode List */}
      {isLoadingEpisodes ? (
        <Card className="rounded-organic">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading episodes from database...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredEpisodes.length === 0 ? (
        <Card className="rounded-organic">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">No episodes found. Try syncing with Spotify!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEpisodes.map((episode) => (
          <Card key={episode.id} className="rounded-organic hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <img 
                    src={episode.thumbnailUrl} 
                    alt={episode.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{episode.title}</h3>
                        {episode.isFeatured && (
                          <Badge className="bg-amber-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {!episode.isVisible && (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                        {episode.youtubeUrl && (
                          <Badge className="bg-red-500 text-white">
                            <Youtube className="h-3 w-3 mr-1" />
                            YouTube
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {episode.description}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFeatured(episode.id)}
                        title={episode.isFeatured ? "Remove from featured" : "Mark as featured"}
                      >
                        {episode.isFeatured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleVisible(episode.id)}
                        title={episode.isVisible ? "Hide episode" : "Show episode"}
                      >
                        {episode.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditEpisode(episode)}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(episode.publishDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {episode.duration}
                    </div>
                    <a 
                      href={episode.spotifyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-green-500 transition-colors"
                    >
                      <Music className="h-4 w-4" />
                      Spotify
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Episode Editor Modal */}
      {isEditing && selectedEpisode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Episode</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedEpisode(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{selectedEpisode.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Spotify Info (Read-only) */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Spotify Info (Auto-synced)</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Publish Date:</span> {formatDate(selectedEpisode.publishDate)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span> {selectedEpisode.duration}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedEpisode.description}
                </p>
              </div>

              <Separator />

              {/* YouTube URL */}
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube Video URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="youtubeUrl"
                    value={selectedEpisode.youtubeUrl || ''}
                    onChange={(e) => handleUpdateField('youtubeUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  {selectedEpisode.youtubeUrl && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(selectedEpisode.youtubeUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Custom Show Notes */}
              <div className="space-y-2">
                <Label htmlFor="customShowNotes">Custom Show Notes</Label>
                <Textarea
                  id="customShowNotes"
                  value={selectedEpisode.customShowNotes || ''}
                  onChange={(e) => handleUpdateField('customShowNotes', e.target.value)}
                  placeholder="Add additional show notes, resources, links..."
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  These notes will appear below the Spotify description on your website
                </p>
              </div>

              {/* Transcript URL */}
              <div className="space-y-2">
                <Label htmlFor="transcriptUrl">Transcript URL</Label>
                <Input
                  id="transcriptUrl"
                  value={selectedEpisode.transcriptUrl || ''}
                  onChange={(e) => handleUpdateField('transcriptUrl', e.target.value)}
                  placeholder="Link to episode transcript..."
                />
              </div>

              {/* SEO Fields */}
              <div className="space-y-4">
                <h4 className="font-semibold">SEO Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={selectedEpisode.seoDescription || ''}
                    onChange={(e) => handleUpdateField('seoDescription', e.target.value)}
                    placeholder="Custom description for search engines (160 characters max)"
                    maxLength={160}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">Keywords</Label>
                  <Input
                    id="seoKeywords"
                    value={selectedEpisode.seoKeywords || ''}
                    onChange={(e) => handleUpdateField('seoKeywords', e.target.value)}
                    placeholder="podcast, metafórica, reflexión, ..."
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={selectedEpisode.isFeatured}
                    onCheckedChange={(checked) => handleUpdateField('isFeatured', checked)}
                    id="featured"
                  />
                  <Label htmlFor="featured">Featured Episode</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={selectedEpisode.isVisible}
                    onCheckedChange={(checked) => handleUpdateField('isVisible', checked)}
                    id="visible"
                  />
                  <Label htmlFor="visible">Visible on Website</Label>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedEpisode(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEpisode}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
