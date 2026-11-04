import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Machinery from './components/Machinery';
import Industries from './components/Industries';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import { api } from './services/api';

export default function App() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & View Modes
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    loadContent();
    checkExistingAuth();

    // Check if #admin hash in URL
    if (window.location.hash === '#admin') {
      handleOpenAdmin();
    }
  }, []);

  const loadContent = async () => {
    try {
      const data = await api.getContent();
      setContent(data);
    } catch (err) {
      console.error('Failed to load content:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingAuth = async () => {
    const token = localStorage.getItem('srisakthi_admin_token');
    const storedUser = localStorage.getItem('srisakthi_admin_user');
    if (token && storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('srisakthi_admin_token');
      }
    }
  };

  const handleOpenAdmin = () => {
    const token = localStorage.getItem('srisakthi_admin_token');
    if (token && adminUser) {
      setIsAdminView(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    setIsLoginOpen(false);
    setIsAdminView(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('srisakthi_admin_token');
    localStorage.removeItem('srisakthi_admin_user');
    setAdminUser(null);
    setIsAdminView(false);
    window.location.hash = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-steel-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin"></div>
        <div className="text-sm font-mono text-slate-400">Connecting to Sri Sakthi Node.js & PostgreSQL Engine...</div>
      </div>
    );
  }

  const company = content?.company || {};
  const hero = content?.hero || {};
  const about = content?.about || {};
  const services = content?.services || [];
  const machinery = content?.machinery || [];

  // If Admin View is active, render the dedicated Admin Console
  if (isAdminView && adminUser) {
    return (
      <AdminLayout
        adminUser={adminUser}
        company={company}
        hero={hero}
        about={about}
        onExitAdmin={() => setIsAdminView(false)}
        onLogout={handleLogout}
        onContentRefresh={loadContent}
      />
    );
  }

  // Public Landing Page
  return (
    <div className="min-h-screen bg-steel-950 text-slate-100 flex flex-col font-sans selection:bg-brand-orange selection:text-white">
      {/* Navigation */}
      <Navbar
        company={company}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Hero Section */}
      <Hero
        hero={hero}
        company={company}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* About Us & Pillars */}
      <About
        about={about}
        company={company}
      />

      {/* Manufacturing Capabilities & Catalog */}
      <Services
        services={services}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* Machine Shop & Metrology Lab */}
      <Machinery
        machinery={machinery}
      />

      {/* Industries We Serve */}
      <Industries />

      {/* Works Location & Direct Contact */}
      <Contact
        company={company}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* Footer */}
      <Footer
        company={company}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Instant RFQ Quote Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        company={company}
      />

      {/* Admin Login Modal */}
      {isLoginOpen && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setIsLoginOpen(false)}
        />
      )}
    </div>
  );
}

