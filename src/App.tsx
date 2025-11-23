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

const mapPathToPage = (path: string): Page => {
  switch (path) {
    case '/':
      return 'home';
    case '/escritos':
      return 'allPosts';
    case '/podcast':
      return 'home';
    case '/libros':
      return 'books';
    case '/sobre-mi':
      return 'about';
    case '/historias':
      return 'historias';
    case '/admin':
      return 'admin';
    case '/login':
      return 'login';
    case '/blog/post':
      return 'blogPost';
    case '/email-preferences':
      return 'emailPreferences';
    default:
      return 'home';
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(null);
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
      const page = mapPathToPage(window.location.pathname);
      if (page === 'admin') {
        handleAdminAccess();
        return;
      }
      if (page === 'login') {
        setShowAdminLogin(true);
        setCurrentPage('home');
        return;
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
      return;
    }

    if (page === 'podcast') {
      const scrollToPodcast = () => {
        const element = document.getElementById("podcast");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      if (currentPage !== "home") {
        setCurrentPage("home");
        setTimeout(scrollToPodcast, 100);
      } else {
        scrollToPodcast();
      }
      return;
    }

    if (page === 'home') {
      setCurrentPage('home');
      setSelectedBlogPostId(null);
      // Scroll to top instantly
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (page === 'books' || page === 'about') {
      if (currentPage !== "home") {
        setCurrentPage("home");
        setSelectedBlogPostId(null);
        setTimeout(() => {
          const sectionId = page === "books" ? "books" : "about";
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else {
        const sectionId = page === "books" ? "books" : "about";
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else {
      setCurrentPage(page);
      if (page !== 'blogPost') {
        setSelectedBlogPostId(null);
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

  const handleReadMore = (postId: string) => {
    setSelectedBlogPostId(postId);
    const path = pageToPath.blogPost;
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setCurrentPage('blogPost');
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
        return <AllBlogPosts onReadPost={(postId) => handleReadMore(postId)} />;
      case 'blogPost':
        return (
          <BlogPost
            postId={selectedBlogPostId}
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
              onReadMore={(postId) => handleReadMore(postId)} 
              onViewAll={() => handleNavigation('allPosts')}
            />
            <PodcastSection />
            <StoriesSection />
            <BooksSection />
            <AboutSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Google Analytics - Replace 'G-XXXXXXXXXX' with your actual Measurement ID */}
      <GoogleAnalytics measurementId="G-XXXXXXXXXX" currentPage={currentPage} />
      
      {currentPage !== 'emailPreferences' && <Header onNavigate={handleNavigation} />}
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