import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { AboutPageEditor } from "./AboutPageEditor";
import { PodcastManager } from "./PodcastManager";
import { WattpadManager } from "./WattpadManager";
import { EmailTemplateManager } from "./EmailTemplateManager";
import { toast } from "sonner";
import { supabase, type BlogPost as SupabaseBlogPost } from "../lib/supabase";
import { 
  Calendar, 
  Edit3, 
  Eye, 
  Plus, 
  Save, 
  Trash2, 
  Upload, 
  Tag, 
  BookOpen, 
  Clock, 
  Search, 
  X, 
  FileUp, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Youtube, 
  ExternalLink, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Type, 
  Heading1, 
  Heading2, 
  Heading3,
  User,
  Award,
  Heart,
  Mic,
  Mail,
  Globe
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  publishDate: string;
  readTime: number;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  featuredImagePath?: string;
}

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishDate: string;
  spotifyUrl: string;
  youtubeUrl?: string;
  tags: string[];
  episodeNumber: number;
  season?: number;
  status: 'draft' | 'published';
}

const mapDbPostToBlogPost = (row: SupabaseBlogPost): BlogPost => ({
  id: row.id,
  title: row.title || 'Untitled',
  content: row.content || '',
  excerpt: row.excerpt || '',
  tags: row.tags || [],
  category: row.category || '',
  status: row.status === 'published' ? 'published' : 'draft',
  publishDate: row.publish_date ? row.publish_date.toString() : new Date().toISOString(),
  readTime: row.read_time ?? 0,
  slug: row.slug || '',
  seoTitle: row.seo_title || '',
  seoDescription: row.seo_description || '',
  featuredImage: row.featured_image_url || '',
  featuredImagePath: row.featured_image_path || ''
});

// Generate URL-friendly slug from title
const generateSlug = (title: string): string => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    // Replace Spanish characters
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n')
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-');
};

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastEpisode | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [mediumUrl, setMediumUrl] = useState('');
  const [mediumImportStatus, setMediumImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [importResults, setImportResults] = useState<{ imported: number; errors: string[] }>({ imported: 0, errors: [] });
  
  // Rich text editor state
  const editorRef = useRef<HTMLDivElement | null>(null);
  const featuredImageInputRef = useRef<HTMLInputElement | null>(null);
  const [showRichToolbar, setShowRichToolbar] = useState(true);
  const [featuredImageUploading, setFeaturedImageUploading] = useState(false);
  const [featuredImageStatus, setFeaturedImageStatus] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    category: '',
    status: 'draft' as 'draft' | 'published',
    publishDate: '',
    slug: '',
    seoTitle: '',
    seoDescription: '',
    featuredImage: '',
    featuredImagePath: ''
  });

  const [podcastForm, setPodcastForm] = useState({
    title: '',
    description: '',
    duration: '',
    tags: '',
    episodeNumber: 0,
    season: 1,
    spotifyUrl: '',
    youtubeUrl: '',
    publishDate: '',
    status: 'draft' as 'draft' | 'published'
  });

  const categories = ['Writing Tips', 'Writing Process', 'Book Reviews', 'Podcast Insights', 'Personal Stories'];

  const loadPosts = async () => {
    if (!supabase) {
      toast.error('Supabase client is not configured.');
      setPostsLoading(false);
      return;
    }

    setPostsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;

      const normalized = ((data ?? []) as SupabaseBlogPost[]).map(mapDbPostToBlogPost);
      setPosts(normalized);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);


  // Search functionality
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    
    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  // Import functionality
  const parseWordPressXML = (xmlContent: string): BlogPost[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'text/xml');
    const items = doc.querySelectorAll('item');
    
    return Array.from(items).map((item, index) => {
      const title = item.querySelector('title')?.textContent || 'Untitled';
      const content = item.querySelector('content\\:encoded')?.textContent || 
                     item.querySelector('[tagName="content:encoded"]')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
      const categories = Array.from(item.querySelectorAll('category')).map(cat => cat.textContent || '');
      
      return {
        id: `import-wp-${Date.now()}-${index}`,
        title,
        content: content.replace(/<[^>]*>/g, ''), // Strip HTML for content
        excerpt: content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        tags: categories.filter(cat => cat && cat !== 'Uncategorized'),
        category: categories[0] || 'Imported',
        status: 'draft' as const,
        publishDate: new Date(pubDate).toISOString().split('T')[0],
        readTime: Math.ceil(content.split(' ').length / 200)
      };
    });
  };

  const parseMediumJSON = (jsonContent: string): BlogPost[] => {
    try {
      const data = JSON.parse(jsonContent);
      const posts = data.posts || data.items || [];
      
      return posts.map((post: any, index: number) => ({
        id: `import-medium-${Date.now()}-${index}`,
        title: post.title || 'Untitled',
        content: post.content || post.body || '',
        excerpt: (post.content || post.body || '').substring(0, 200) + '...',
        tags: post.tags || [],
        category: 'Imported',
        status: 'draft' as const,
        publishDate: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        readTime: Math.ceil((post.content || post.body || '').split(' ').length / 200)
      }));
    } catch (error) {
      throw new Error('Invalid Medium JSON format');
    }
  };

  const handleMediumUrlImport = async () => {
    if (!mediumUrl.trim()) {
      toast.error('Please enter a Medium post URL');
      return;
    }

    if (!mediumUrl.includes('medium.com')) {
      toast.error('Please enter a valid Medium URL');
      return;
    }

    setMediumImportStatus('processing');

    try {
      const { data, error } = await supabase.functions.invoke('import-medium-post', {
        body: { url: mediumUrl },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.success) {
        toast.success(data.message || 'Medium post imported successfully!');
        setMediumImportStatus('success');
        setMediumUrl('');
        
        // Reload posts to show the new import
        await loadPosts();
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setMediumImportStatus('idle');
        }, 3000);
      } else {
        throw new Error('Unexpected response from import function');
      }
    } catch (error: any) {
      console.error('Medium import error:', error);
      toast.error(error.message || 'Failed to import Medium post');
      setMediumImportStatus('error');
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setMediumImportStatus('idle');
      }, 5000);
    }
  };

  const handleFileImport = async (file: File) => {
    if (!supabase) {
      toast.error('Supabase client is not configured.');
      return;
    }
    setImportStatus('processing');
    setImportProgress(0);
    setImportResults({ imported: 0, errors: [] });

    try {
      const content = await file.text();
      let importedPosts: BlogPost[] = [];
      
      // Determine file type and parse accordingly
      if (file.name.toLowerCase().includes('wordpress') || file.name.endsWith('.xml')) {
        importedPosts = parseWordPressXML(content);
      } else if (file.name.toLowerCase().includes('medium') || file.name.endsWith('.json')) {
        importedPosts = parseMediumJSON(content);
      } else {
        // Try to auto-detect format
        if (content.trim().startsWith('<') && content.includes('wordpress')) {
          importedPosts = parseWordPressXML(content);
        } else if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
          importedPosts = parseMediumJSON(content);
        } else {
          throw new Error('Unsupported file format. Please use WordPress XML or Medium JSON export.');
        }
      }

      // Simulate processing time and add posts
      for (let i = 0; i < importedPosts.length; i++) {
        setImportProgress((i + 1) / importedPosts.length * 100);
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing
      }

      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert(importedPosts.map(post => ({
          ...post,
          seoTitle: post.seoTitle || '',
          seoDescription: post.seoDescription || ''
        })));

      if (insertError) throw insertError;

      await loadPosts();
      setImportResults({ imported: importedPosts.length, errors: [] });
      setImportStatus('success');

    } catch (error) {
      setImportResults({ imported: 0, errors: [error instanceof Error ? error.message : 'Import failed'] });
      setImportStatus('error');
    }
  };

  const openFeaturedImagePicker = () => {
    featuredImageInputRef.current?.click();
  };

  const handleFeaturedImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFeaturedImageUpload(file);
    }
  };

  const handleFeaturedImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFeaturedImageUpload(file);
    }
  };

  const handleFeaturedImageUpload = async (file: File) => {
    if (!supabase) {
      toast.error('Supabase client is not configured.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file.');
      return;
    }

    setFeaturedImageUploading(true);
    setFeaturedImageStatus('Uploading…');

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `featured-${crypto.randomUUID()}.${extension}`;
      const { data, error } = await supabase
        .storage
        .from('blog-assets')
        .upload(filename, file, { cacheControl: '3600', upsert: true });

      if (error || !data) {
        throw error ?? new Error('Upload failed');
      }

      const { data: urlData } = supabase
        .storage
        .from('blog-assets')
        .getPublicUrl(data.path);

      if (!urlData?.publicUrl) {
        throw new Error('Could not build preview URL');
      }

      setEditForm((prev) => ({
        ...prev,
        featuredImage: urlData.publicUrl,
        featuredImagePath: data.path
      }));
      setFeaturedImageStatus('Uploaded');
      toast.success('Featured image uploaded');
    } catch (uploadError) {
      console.error('Featured image upload failed', uploadError);
      setFeaturedImageStatus('Upload failed');
      toast.error('Image upload failed');
    } finally {
      setFeaturedImageUploading(false);
      if (featuredImageInputRef.current) {
        featuredImageInputRef.current.value = '';
      }
    }
  };

  const onEditorInput = () => {
    const html = editorRef.current?.innerHTML || '';
    setEditForm((prev) => ({ ...prev, content: html }));
  };

  // Sync editForm.content to editor when content changes
  useEffect(() => {
    if (editorRef.current && editForm.content !== undefined) {
      const currentContent = editorRef.current.innerHTML.trim();
      const formContent = editForm.content.trim();
      // Only update if they're actually different (avoid infinite loops)
      if (currentContent !== formContent && formContent !== '') {
        editorRef.current.innerHTML = editForm.content;
      }
    }
  }, [editForm.content]);

  // Ensure editor content is loaded when editing starts or selectedPost changes
  useEffect(() => {
    if (isEditing && activeTab === 'editor' && selectedPost && editorRef.current) {
      // Use setTimeout to ensure DOM is ready after tab switch
      const timer = setTimeout(() => {
        if (editorRef.current && selectedPost.content) {
          const currentContent = editorRef.current.innerHTML.trim();
          const postContent = selectedPost.content.trim();
          // Only update if content is different and post content exists
          if (currentContent !== postContent && postContent !== '') {
            console.log('Loading content into editor:', postContent.substring(0, 50) + '...');
            editorRef.current.innerHTML = selectedPost.content;
            // Ensure editForm is also updated
            if (editForm.content !== selectedPost.content) {
              setEditForm(prev => ({ ...prev, content: selectedPost.content }));
            }
          }
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [isEditing, selectedPost?.id, activeTab, selectedPost?.content]);

  const applyEditorCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    onEditorInput();
  };

  const formatText = async (format: string) => {
    if (!editorRef.current) return;

    switch (format) {
      case 'bold':
        applyEditorCommand('bold');
        break;
      case 'italic':
        applyEditorCommand('italic');
        break;
      case 'underline':
        applyEditorCommand('underline');
        break;
      case 'strikethrough':
        applyEditorCommand('strikeThrough');
        break;
      case 'h1':
      case 'h2':
      case 'h3':
        applyEditorCommand('formatBlock', `h${format.slice(1)}`);
        break;
      case 'quote':
        applyEditorCommand('formatBlock', 'blockquote');
        break;
      case 'ul':
        applyEditorCommand('insertUnorderedList');
        break;
      case 'ol':
        applyEditorCommand('insertOrderedList');
        break;
      case 'link': {
        const url = prompt('Enter the full URL');
        if (url) {
          applyEditorCommand('createLink', url);
        }
        break;
      }
      default:
        break;
    }
  };

  const insertLineBreak = () => {
    applyEditorCommand('insertHTML', '<br><br>');
  };

  const handleNewPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: '',
      content: '',
      excerpt: '',
      tags: [],
      category: '',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0],
      readTime: 0,
      slug: '',
      seoTitle: '',
      seoDescription: '',
      featuredImage: '',
      featuredImagePath: ''
    };
    setSelectedPost(newPost);
    setEditForm({
      title: newPost.title,
      content: newPost.content,
      excerpt: newPost.excerpt,
      tags: newPost.tags.join(', '),
      category: newPost.category,
      status: newPost.status,
      publishDate: newPost.publishDate,
      slug: newPost.slug || '',
      seoTitle: newPost.seoTitle || '',
      seoDescription: newPost.seoDescription || '',
      featuredImage: newPost.featuredImage || '',
      featuredImagePath: newPost.featuredImagePath || ''
    });
    setIsEditing(true);
    setActiveTab('editor');
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setEditForm({
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt || '',
      tags: post.tags.join(', '),
      category: post.category,
      status: post.status,
      publishDate: post.publishDate,
      slug: post.slug || '',
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      featuredImage: post.featuredImage || '',
      featuredImagePath: post.featuredImagePath || ''
    });
    setIsEditing(true);
    setActiveTab('editor');
    
    // Ensure editor content is set after a brief delay to allow DOM to update
    setTimeout(() => {
      if (editorRef.current && post.content) {
        editorRef.current.innerHTML = post.content;
      }
    }, 100);
  };

  const handleSavePost = async () => {
    if (!selectedPost) return;
    if (!supabase) {
      toast.error('Supabase client is not configured.');
      return;
    }

    // Generate slug if not provided or if title changed
    let finalSlug = editForm.slug.trim();
    if (!finalSlug && editForm.title) {
      finalSlug = generateSlug(editForm.title);
    }

    // Check for duplicate slugs (excluding current post) - only if slug column exists
    let slugColumnExists = false;
    if (finalSlug) {
      try {
        const { data: existingPosts, error: slugCheckError } = await supabase
          .from('blog_posts')
          .select('id, slug')
          .eq('slug', finalSlug);
        
        // If error is about column not existing, skip slug functionality
        if (slugCheckError && (slugCheckError.code === 'PGRST204' || slugCheckError.message?.includes('slug'))) {
          console.warn('Slug column does not exist yet, skipping slug functionality');
          slugColumnExists = false;
        } else if (!slugCheckError) {
          slugColumnExists = true;
          if (existingPosts && existingPosts.length > 0) {
            const isDuplicate = existingPosts.some(p => p.id !== selectedPost.id);
            if (isDuplicate) {
              // Append number to make unique
              let counter = 1;
              let uniqueSlug = `${finalSlug}-${counter}`;
              while (existingPosts.some(p => p.slug === uniqueSlug && p.id !== selectedPost.id)) {
                counter++;
                uniqueSlug = `${finalSlug}-${counter}`;
              }
              finalSlug = uniqueSlug;
            }
          }
        }
      } catch (err) {
        console.warn('Error checking slug, assuming column does not exist:', err);
        slugColumnExists = false;
      }
    }

    const payload: Partial<SupabaseBlogPost> = {
      title: editForm.title,
      content: editForm.content,
      excerpt: editForm.excerpt,
      tags: editForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      category: editForm.category,
      status: editForm.status,
      publish_date: editForm.publishDate,
      read_time: Math.ceil(editForm.content.split(' ').length / 200),
      featured_image_url: editForm.featuredImage,
      featured_image_path: editForm.featuredImagePath || undefined,
      seo_title: editForm.seoTitle,
      seo_description: editForm.seoDescription
    };

    // Only include slug if column exists
    if (slugColumnExists && finalSlug) {
      (payload as any).slug = finalSlug;
    }

    try {
      const exists = posts.some((post) => post.id === selectedPost.id);
      if (exists) {
        const { error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', selectedPost.id);
        if (error) {
          // If error is about slug column, try again without slug
          if (error.code === 'PGRST204' && (payload as any).slug) {
            console.warn('Slug column does not exist, retrying without slug');
            delete (payload as any).slug;
            const { error: retryError } = await supabase
              .from('blog_posts')
              .update(payload)
              .eq('id', selectedPost.id);
            if (retryError) throw retryError;
          } else {
            throw error;
          }
        }
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(payload)
          .select()
          .single();
        if (error) {
          // If error is about slug column, try again without slug
          if (error.code === 'PGRST204' && (payload as any).slug) {
            console.warn('Slug column does not exist, retrying without slug');
            delete (payload as any).slug;
            const { data: retryData, error: retryError } = await supabase
              .from('blog_posts')
              .insert(payload)
              .select()
              .single();
            if (retryError) throw retryError;
            if (retryData) {
              setSelectedPost(mapDbPostToBlogPost(retryData));
            }
          } else {
            throw error;
          }
        } else {
          if (data) {
            setSelectedPost(mapDbPostToBlogPost(data));
          }
        }
      }

      toast.success('Post saved successfully!');
      await loadPosts();
      setIsEditing(false);
      setActiveTab('posts');
    } catch (error) {
      console.error('Error saving post:', error);
      const toastMessage = (error as any)?.message || 'Failed to save post';
      toast.error(toastMessage);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    if (!supabase) {
      toast.error('Supabase client is not configured.');
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast.success('Post deleted successfully!');
      await loadPosts();
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl text-shadow-warm mb-2">Blog Content Manager</h2>
        <p className="text-muted-foreground">Create, edit, and manage your Metaforica blog posts</p>
      </div>

      <style>{`
        button[data-state="active"][id*="trigger-posts"],
        button[data-state="active"][id*="trigger-editor"],
        button[data-state="active"][id*="trigger-podcasts"],
        button[data-state="active"][id*="trigger-wattpad"],
        button[data-state="active"][id*="trigger-about"],
        button[data-state="active"][id*="trigger-email"],
        button[data-state="active"][id*="trigger-import"],
        button[data-state="active"][id*="trigger-analytics"] {
          background-color: #020202 !important;
          color: #fdd91f !important;
          font-weight: bold !important;
        }
      `}</style>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="posts" className="flex items-center gap-2 !data-[state=active]:bg-black !data-[state=active]:text-yellow-400">
            <BookOpen className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2 !data-[state=active]:bg-black !data-[state=active]:text-yellow-400">
            <Edit3 className="h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="podcasts" className="flex items-center gap-2 !data-[state=active]:bg-black !data-[state=active]:text-yellow-400">
            <Mic className="h-4 w-4" />
            Podcasts
          </TabsTrigger>
          <TabsTrigger value="wattpad" className="flex items-center gap-2 !data-[state=active]:bg-black !data-[state=active]:text-yellow-400">
            <BookOpen className="h-4 w-4" />
            Wattpad
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2 !data-[state=active]:bg-[#020202] !data-[state=active]:text-[#fdd91f] !data-[state=active]:font-bold !data-[state=active]:border-2 !data-[state=active]:border-[#020202]">
            <User className="h-4 w-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2 !data-[state=active]:bg-[#020202] !data-[state=active]:text-[#fdd91f] !data-[state=active]:font-bold !data-[state=active]:border-2 !data-[state=active]:border-[#020202]">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2 !data-[state=active]:bg-[#020202] !data-[state=active]:text-[#fdd91f] !data-[state=active]:font-bold !data-[state=active]:border-2 !data-[state=active]:border-[#020202]">
            <FileUp className="h-4 w-4" />
            Import
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 !data-[state=active]:bg-[#020202] !data-[state=active]:text-[#fdd91f] !data-[state=active]:font-bold !data-[state=active]:border-2 !data-[state=active]:border-[#020202]">
            <Eye className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="flex justify-between items-center gap-4">
            <h3 className="text-xl">All Posts</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 w-[300px]"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button onClick={handleNewPost} className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>
                Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} 
                {filteredPosts.length !== posts.length && ` of ${posts.length} total`}
              </span>
              {filteredPosts.length === 0 && (
                <span className="text-destructive">No posts match your search.</span>
              )}
            </div>
          )}

          {postsLoading ? (
            <div className="text-sm text-muted-foreground py-6">Loading posts…</div>
          ) : (
            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="rounded-organic border-2 border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                        <CardDescription className="mb-3">{post.excerpt}</CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.publishDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime} min read
                          </span>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm bg-accent px-2 py-1 rounded-md">{post.category}</span>
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-md flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          {isEditing ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="rounded-organic">
                  <CardHeader>
                    <CardTitle>Post Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={editForm.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          // Auto-generate slug if slug is empty or matches the old title's slug
                          const currentSlugFromTitle = generateSlug(editForm.title);
                          const shouldAutoGenerate = !editForm.slug || editForm.slug === currentSlugFromTitle;
                          const newSlug = shouldAutoGenerate ? generateSlug(newTitle) : editForm.slug;
                          setEditForm({...editForm, title: newTitle, slug: newSlug});
                        }}
                        placeholder="Enter post title..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={editForm.slug}
                        onChange={(e) => setEditForm({...editForm, slug: generateSlug(e.target.value)})}
                        placeholder="url-friendly-slug"
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Auto-generated from title. Edit manually if needed. Will be used in URL: /escritos/[slug]
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={editForm.excerpt}
                        onChange={(e) => setEditForm({...editForm, excerpt: e.target.value})}
                        placeholder="Brief description of the post..."
                        className="mt-1 min-h-[80px]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="content">Content</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowRichToolbar(!showRichToolbar)}
                            className="text-xs"
                          >
                            <Type className="h-3 w-3 mr-1" />
                            {showRichToolbar ? 'Hide' : 'Show'} Toolbar
                          </Button>
                        </div>
                      </div>

                      {/* Rich Text Editor Toolbar */}
                      {showRichToolbar && (
                        <div className="border border-border rounded-lg p-3 mb-2 bg-muted/50">
                          <div className="flex flex-wrap gap-1">
                            {/* Text Formatting */}
                            <div className="flex gap-1 border-r border-border pr-2 mr-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('bold')}
                                className="h-8 w-8 p-0"
                                title="Bold (Ctrl+B)"
                              >
                                <Bold className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('italic')}
                                className="h-8 w-8 p-0"
                                title="Italic (Ctrl+I)"
                              >
                                <Italic className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('underline')}
                                className="h-8 w-8 p-0"
                                title="Underline (Ctrl+U)"
                              >
                                <Underline className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('strikethrough')}
                                className="h-8 w-8 p-0"
                                title="Strikethrough"
                              >
                                <Strikethrough className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Headings */}
                            <div className="flex gap-1 border-r border-border pr-2 mr-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('h1')}
                                className="h-8 w-8 p-0"
                                title="Heading 1"
                              >
                                <Heading1 className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('h2')}
                                className="h-8 w-8 p-0"
                                title="Heading 2"
                              >
                                <Heading2 className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('h3')}
                                className="h-8 w-8 p-0"
                                title="Heading 3"
                              >
                                <Heading3 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Lists */}
                            <div className="flex gap-1 border-r border-border pr-2 mr-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('ul')}
                                className="h-8 w-8 p-0"
                                title="Bullet List"
                              >
                                <List className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('ol')}
                                className="h-8 w-8 p-0"
                                title="Numbered List"
                              >
                                <ListOrdered className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('quote')}
                                className="h-8 w-8 p-0"
                                title="Quote"
                              >
                                <Quote className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Links and Special */}
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => formatText('link')}
                                className="h-8 w-8 p-0"
                                title="Insert Link"
                              >
                                <Link className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={insertLineBreak}
                                className="h-8 w-auto px-2 text-xs"
                                title="Insert Line Break"
                              >
                                ↵ BR
                              </Button>
                            </div>
                          </div>

                          {/* Quick Format Guide */}
                          <div className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium">Quick tips:</span> Select text and click the toolbar buttons, or use Ctrl/Cmd+B/I/U for bold/italic/underline.
                          </div>
                        </div>
                      )}

                      <div
                        ref={editorRef}
                        id="content"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={onEditorInput}
                        className="rich-text-content mt-1 min-h-[400px] resize-y border border-border bg-white/80 p-4 text-sm"
                        onKeyDown={(e) => {
                          if (e.ctrlKey || e.metaKey) {
                            switch (e.key.toLowerCase()) {
                              case 'b':
                                e.preventDefault();
                                formatText('bold');
                                break;
                              case 'i':
                                e.preventDefault();
                                formatText('italic');
                                break;
                              case 'u':
                                e.preventDefault();
                                formatText('underline');
                                break;
                              default:
                                break;
                            }
                          }
                        }}
                      />
                      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                        <span>
                          Support for Markdown formatting. Word count: {editForm.content.split(' ').filter(word => word.length > 0).length}
                        </span>
                        <span>
                          Characters: {editForm.content.length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-organic">
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>Optimize your post for search engines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="seoTitle">SEO Title</Label>
                      <Input
                        id="seoTitle"
                        value={editForm.seoTitle}
                        onChange={(e) => setEditForm({...editForm, seoTitle: e.target.value})}
                        placeholder="SEO optimized title..."
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {editForm.seoTitle.length}/60 characters
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="seoDescription">SEO Description</Label>
                      <Textarea
                        id="seoDescription"
                        value={editForm.seoDescription}
                        onChange={(e) => setEditForm({...editForm, seoDescription: e.target.value})}
                        placeholder="SEO meta description..."
                        className="mt-1 min-h-[80px]"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {editForm.seoDescription.length}/160 characters
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="rounded-organic">
                  <CardHeader>
                    <CardTitle>Publish Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={editForm.status === 'published'}
                        onCheckedChange={(checked) => 
                          setEditForm({...editForm, status: checked ? 'published' : 'draft'})
                        }
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="publishDate">Fecha de Publicación</Label>
                      <Input
                        id="publishDate"
                        type="date"
                        value={editForm.publishDate}
                        onChange={(e) => setEditForm({...editForm, publishDate: e.target.value})}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Usa esta fecha para contenido importado o programar publicaciones
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={editForm.tags}
                        onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                        placeholder="writing, creativity, tips..."
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate tags with commas
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="featuredImage">Featured Image</Label>
                      <div
                        onClick={openFeaturedImagePicker}
                        onDragOver={(event) => event.preventDefault()}
                        onDragEnter={(event) => event.preventDefault()}
                        onDrop={handleFeaturedImageDrop}
                        className="mt-1 cursor-pointer border-2 border-dashed border-border rounded-lg bg-muted/40 px-4 py-6 text-center transition hover:border-primary"
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click or drop an image to upload to `blog-assets`
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          WebP or JPG preferred (max 2MB)
                        </p>
                        <input
                          ref={featuredImageInputRef}
                          id="featuredImage"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFeaturedImageSelect}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {featuredImageUploading
                          ? 'Uploading…'
                          : featuredImageStatus || 'Supported: JPG, PNG, WebP'}
                      </p>
                      {editForm.featuredImage && (
                        <div className="mt-3 overflow-hidden rounded-lg border border-border">
                          <img
                            src={editForm.featuredImage}
                            alt="Featured preview"
                            className="h-36 w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSavePost}
                    className="flex-1 bg-primary text-primary-foreground"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Post
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Card className="rounded-organic text-center p-12">
              <Edit3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl mb-2">No Post Selected</h3>
              <p className="text-muted-foreground mb-6">
                Select a post to edit or create a new one to get started.
              </p>
              <Button onClick={handleNewPost} className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card className="rounded-organic">
            <CardHeader>
              <CardTitle>Import Content</CardTitle>
              <CardDescription>
                Import your existing blog posts from WordPress or Medium
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg mb-2">Drop files here or click to upload</h3>
                <p className="text-muted-foreground mb-4">
                  Supports WordPress XML export files and Medium JSON export files
                </p>
                <Button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.xml,.json';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileImport(file);
                    };
                    input.click();
                  }}
                  className="mb-4"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 10MB
                </p>
              </div>

              {importStatus === 'processing' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Importing posts...</span>
                    <span>{Math.round(importProgress)}%</span>
                  </div>
                  <Progress value={importProgress} />
                </div>
              )}

              {importStatus === 'success' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully imported {importResults.imported} posts!
                  </AlertDescription>
                </Alert>
              )}

              {importStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Import failed: {importResults.errors.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Medium URL Import */}
          <Card className="rounded-organic border-2 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Import from Medium
              </CardTitle>
              <CardDescription>
                Paste a Medium post URL and we'll automatically import the content, images, and metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://medium.com/@metaforicapodcast/your-post-slug"
                  value={mediumUrl}
                  onChange={(e) => setMediumUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && mediumImportStatus !== 'processing') {
                      handleMediumUrlImport();
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  onClick={handleMediumUrlImport}
                  disabled={mediumImportStatus === 'processing' || !mediumUrl.trim()}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {mediumImportStatus === 'processing' ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Importing...
                    </div>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Import
                    </>
                  )}
                </Button>
              </div>

              {mediumImportStatus === 'processing' && (
                <Alert className="border-blue-500/50 text-blue-700">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    <AlertDescription>
                      Fetching and parsing Medium post...
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {mediumImportStatus === 'success' && (
                <Alert className="border-green-500/50 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully imported post! Check the Posts tab to see it.
                  </AlertDescription>
                </Alert>
              )}

              {mediumImportStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to import Medium post. Make sure the URL is valid and publicly accessible.
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>What gets imported:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Title and content (formatted as HTML)</li>
                    <li>Featured image and publish date</li>
                    <li>Author, tags, and read time</li>
                    <li>The post will be sorted by its original publish date</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <AboutPageEditor />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="podcasts" className="space-y-6">
          <PodcastManager />
        </TabsContent>

        <TabsContent value="wattpad" className="space-y-6">
          <WattpadManager />
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <EmailTemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}