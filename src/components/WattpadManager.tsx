import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Star,
  StarOff,
  ExternalLink,
  BookOpen,
  Heart,
  MessageCircle,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase, type WattpadStory } from "../lib/supabase";

export function WattpadManager() {
  const [stories, setStories] = useState<WattpadStory[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setIsLoadingStories(true);
    try {
      const { data, error } = await supabase
        .from('wattpad_stories')
        .select('*')
        .order('read_count', { ascending: false });

      if (error) throw error;

      if (data) {
        setStories(data as WattpadStory[]);
        // Get last sync time from most recent story
        if (data.length > 0 && data[0].last_synced_at) {
          setLastSync(new Date(data[0].last_synced_at));
        }
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      toast.error('Failed to load stories from database');
    } finally {
      setIsLoadingStories(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(
        'https://fdfchoshzouwguvxfnuv.supabase.co/functions/v1/sync-wattpad-stories',
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
      toast.success(`Synced ${result.synced || 0} stories from Wattpad!`);
      
      // Reload stories after successful sync
      await loadStories();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync with Wattpad. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleFeatured = async (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const newFeaturedState = !story.is_featured;
    
    try {
      const { error } = await supabase
        .from('wattpad_stories')
        .update({ is_featured: newFeaturedState })
        .eq('id', storyId);

      if (error) throw error;

      setStories(stories.map(s => 
        s.id === storyId ? { ...s, is_featured: newFeaturedState } : s
      ));
      toast.success(newFeaturedState ? "Marked as featured" : "Removed from featured");
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const handleToggleVisible = async (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const newVisibleState = !story.is_visible;
    
    try {
      const { error } = await supabase
        .from('wattpad_stories')
        .update({ is_visible: newVisibleState })
        .eq('id', storyId);

      if (error) throw error;

      setStories(stories.map(s => 
        s.id === storyId ? { ...s, is_visible: newVisibleState } : s
      ));
      toast.success(newVisibleState ? "Story visible" : "Story hidden");
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const totalReads = stories.reduce((sum, s) => sum + s.read_count, 0);
  const totalVotes = stories.reduce((sum, s) => sum + s.vote_count, 0);
  const completedStories = stories.filter(s => s.is_completed).length;

  return (
    <div className="space-y-6">
      {/* Sync Controls */}
      <Card className="rounded-organic border-2 border-purple-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                Wattpad Sync
              </CardTitle>
              <CardDescription>
                {lastSync 
                  ? `Last synced: ${lastSync.toLocaleString('es-ES')}`
                  : 'Never synced'
                }
              </CardDescription>
            </div>
            <Button 
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold">{stories.length}</div>
              <div className="text-sm text-muted-foreground">Total Stories</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold">{formatNumber(totalReads)}</div>
              <div className="text-sm text-muted-foreground">Total Reads</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold">{formatNumber(totalVotes)}</div>
              <div className="text-sm text-muted-foreground">Total Votes</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold">{completedStories}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Story List */}
      {isLoadingStories ? (
        <Card className="rounded-organic">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading stories from database...</p>
            </div>
          </CardContent>
        </Card>
      ) : stories.length === 0 ? (
        <Card className="rounded-organic">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">No stories found. Try syncing with Wattpad!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {stories.map((story) => (
            <Card key={story.id} className="rounded-organic hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-6">
                  {/* Cover Image */}
                  <div className="flex-shrink-0">
                    <img 
                      src={story.cover_image_url} 
                      alt={story.title}
                      className="w-24 h-32 rounded-lg object-cover shadow-md"
                    />
                  </div>

                  {/* Story Info */}
                  <div className="flex-grow space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold">{story.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {story.is_featured && (
                              <Badge className="bg-yellow-500">Featured</Badge>
                            )}
                            {story.is_completed && (
                              <Badge variant="outline" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Completed
                              </Badge>
                            )}
                            {!story.is_visible && (
                              <Badge variant="secondary">Hidden</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {story.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {story.tags.slice(0, 5).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {formatNumber(story.read_count)} reads
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {formatNumber(story.vote_count)} votes
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {formatNumber(story.comment_count)} comments
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {story.part_count} parts
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(story.id)}
                        className="gap-2"
                      >
                        {story.is_featured ? (
                          <>
                            <StarOff className="h-4 w-4" />
                            Unfeature
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4" />
                            Feature
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleVisible(story.id)}
                        className="gap-2"
                      >
                        {story.is_visible ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Show
                          </>
                        )}
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="gap-2 bg-purple-500 hover:bg-purple-600"
                      >
                        <a href={story.story_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          View on Wattpad
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


