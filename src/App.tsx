import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { BlogSection } from "./components/BlogSection";
import { PodcastSection } from "./components/PodcastSection";
import { BooksSection } from "./components/BooksSection";
import { AboutSection } from "./components/AboutSection";
import { StoriesSection } from "./components/StoriesSection";
import { Footer } from "./components/Footer";
import { BlogManager } from "./components/BlogManager";
import { AllBlogPosts } from "./components/AllBlogPosts";
import { BlogPost } from "./components/BlogPost";
import { AllStories } from "./components/AllStories";
import { AdminLogin } from "./components/AdminLogin";
import { EmailPreferences } from "./components/EmailPreferences";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { Button } from "./components/ui/button";
import { Settings } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { supabase } from "./lib/supabase";

type Page = 'home' | 'blog' | 'allPosts' | 'podcast' | 'books' | 'about' | 'historias' | 'admin' | 'blogPost' | 'emailPreferences' | 'login';

const pageToPath: Record<Page, string> = {
  home: '/',
  blog: '/blog',
  allPosts: '/escritos',
  podcast: '/podcast',
  books: '/libros',
  about: '/sobre-mi',
  historias: '/historias',
  admin: '/admin',
  blogPost: '/blog/post',
  emailPreferences: '/email-preferences',
  login: '/login'
};

const mapPathToPage = (path: string): { page: Page; slug?: string } => {
  // Normalize path - remove trailing slash (except root)
  const normalizedPath = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
  
  // Check for blog post slug pattern: /escritos/[slug]
  const escritosMatch = normalizedPath.match(/^\/escritos\/([^/]+)$/);
  if (escritosMatch) {
    return { page: 'blogPost', slug: escritosMatch[1] };
  }
  
  switch (normalizedPath) {
    case '/':
      return { page: 'home' };
    case '/escritos':
      return { page: 'allPosts' };
    case '/podcast':
      return { page: 'home' };
    case '/libros':
      return { page: 'books' };
    case '/sobre-mi':
      return { page: 'about' };
    case '/historias':
      return { page: 'historias' };
    case '/admin':
      return { page: 'admin' };
    case '/login':
      return { page: 'login' };
    case '/email-preferences':
      return { page: 'emailPreferences' };
    default:
      return { page: 'home' };
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedBlogPostSlug, setSelectedBlogPostSlug] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const shouldNoIndex = showAdminPanel || showAdminLogin;

  useEffect(() => {
    const selector = 'meta[name="robots"][data-cursor-admin="true"]';
    let meta = document.head.querySelector<HTMLMetaElement>(selector);

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      meta.dataset.cursorAdmin = "true";
      document.head.append(meta);
    }

    meta.content = shouldNoIndex ? "noindex,nofollow" : "index,follow";

    return () => {
      if (meta && !shouldNoIndex) {
        meta.remove();
      }
    };
  }, [shouldNoIndex]);

  // Update canonical URL based on current page
  useEffect(() => {
    const baseUrl = 'https://soymetaforica.com';
    let canonicalUrl: string;
    
    if (currentPage === 'blogPost' && selectedBlogPostSlug) {
      canonicalUrl = `${baseUrl}/escritos/${selectedBlogPostSlug}`;
    } else {
      const canonicalMap: Record<Page, string> = {
        home: `${baseUrl}/`,
        allPosts: `${baseUrl}/escritos`,
        books: `${baseUrl}/libros`,
        about: `${baseUrl}/sobre-mi`,
        historias: `${baseUrl}/historias`,
        blog: `${baseUrl}/blog`,
        podcast: `${baseUrl}/`,
        blogPost: `${baseUrl}/escritos`,
        admin: `${baseUrl}/admin`,
        emailPreferences: `${baseUrl}/email-preferences`,
        login: `${baseUrl}/login`
      };
      canonicalUrl = canonicalMap[currentPage] || `${baseUrl}/`;
    }
    
    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
  }, [currentPage]);

  // Check authentication state on mount and listen for changes
  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (!session && showAdminPanel) {
        setShowAdminPanel(false);
        setCurrentPage('home');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [showAdminPanel]);

  useEffect(() => {
    const resolvePath = () => {
      // Normalize path by removing trailing slashes (except root)
      let path = window.location.pathname;
      if (path !== '/' && path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      const result = mapPathToPage(path);
      const page = result.page;
      if (page === 'admin') {
        handleAdminAccess();
        return;
      }
      if (page === 'login') {
        setShowAdminLogin(true);
        setCurrentPage('home');
        return;
      }
      if (page === 'blogPost' && result.slug) {
        setSelectedBlogPostSlug(result.slug);
      }
      setCurrentPage(page);
      // Scroll to top on route change (except for anchor links)
      if (!window.location.hash) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };

    resolvePath();
    window.addEventListener('popstate', resolvePath);
    return () => window.removeEventListener('popstate', resolvePath);
  }, []);



  const handleNavigation = (page: Page) => {
    const path = pageToPath[page];
    if (path && window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }

    if (page === 'admin') {
      handleAdminAccess();
      return;
    }

    if (page === 'login') {
      setShowAdminLogin(true);
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // Handle anchor links (podcast, books, about)
    if (page === 'podcast' || page === 'books' || page === 'about') {
      const sectionId = page === "podcast" ? "podcast" : page === "books" ? "books" : "about";
      
      if (currentPage !== "home") {
        // Coming from a non-homepage: scroll to top first, then to section
        setCurrentPage("home");
        setSelectedBlogPostId(null);
        window.scrollTo({ top: 0, behavior: "instant" });
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      } else {
        // Already on homepage: just scroll to section (keep current behavior)
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      return;
    }

    if (page === 'home') {
      setCurrentPage('home');
      setSelectedBlogPostSlug(null);
      // Scroll to top instantly
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      // For all other pages (allPosts, historias, blogPost, etc.)
      setCurrentPage(page);
      if (page !== 'blogPost') {
        setSelectedBlogPostSlug(null);
      }
      // Scroll to top instantly for all page changes
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      setShowAdminLogin(false);
      setShowAdminPanel(true);
    }
  };

  const handleAdminAccess = () => {
    if (isLoggedIn) {
      setShowAdminPanel(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setShowAdminPanel(false);
    setCurrentPage('home');
  };

  const handleReadMore = (slug: string) => {
    setSelectedBlogPostSlug(slug);
    const path = `/escritos/${slug}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setCurrentPage('blogPost');
    // Scroll to top when opening a blog post
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Admin Login Screen
  if (showAdminLogin) {
    return (
      <AdminLogin 
        onLogin={handleAdminLogin}
        onCancel={() => setShowAdminLogin(false)}
      />
    );
  }

  // Admin Panel
  if (showAdminPanel) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Metafórica Admin</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAdminPanel(false)}
              variant="outline"
            >
              Volver al Sitio Web
            </Button>
            <Button 
              onClick={handleLogout}
              variant="destructive"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
        <BlogManager />
      </div>
    );
  }

  // Regular pages routing
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'allPosts':
        return <AllBlogPosts onReadPost={(slug) => handleReadMore(slug)} />;
      case 'blogPost':
        return (
          <BlogPost
            slug={selectedBlogPostSlug}
            onBack={() => handleNavigation('home')}
          />
        );
      case 'historias':
        return <AllStories />;
      case 'emailPreferences':
        return <EmailPreferences onBack={() => setCurrentPage('home')} />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <BlogSection 
              onReadMore={(slug) => handleReadMore(slug)} 
              onViewAll={() => handleNavigation('allPosts')}
            />
            <PodcastSection />
            <StoriesSection onNavigate={handleNavigation} />
            <BooksSection />
            <AboutSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Google Analytics */}
      <GoogleAnalytics measurementId="G-LFQ0BL4777" currentPage={currentPage} />
      
      {currentPage !== 'emailPreferences' && currentPage !== 'blogPost' && <Header onNavigate={handleNavigation} />}
      <main id="main-content">
        {renderCurrentPage()}
      </main>
      {currentPage !== 'emailPreferences' && <Footer onNavigate={handleNavigation} />}
      
      {/* Discrete Admin Access - triple click on logo area */}
      <div 
        className="fixed bottom-4 left-4 opacity-20 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={(e) => {
          if (e.detail === 3) { // Triple click
            handleAdminAccess();
          }
        }}
      >
        <Button 
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </div>
  );
}