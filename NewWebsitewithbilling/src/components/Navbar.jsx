import React, { useState, useEffect } from 'react';
import { Phone, Mail, ShieldCheck, Menu, X, ArrowRight, Cog } from 'lucide-react';

export default function Navbar({ company, onOpenQuote, onOpenAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Capabilities', href: '#services' },
    { label: 'Machinery', href: '#machinery' },
    { label: 'Industries', href: '#industries' },
    { label: 'Quality Lab', href: '#quality' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Utility Bar */}
      <div className="bg-steel-950/90 border-b border-slate-800/80 text-xs text-slate-400 py-1.5 px-4 sm:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono font-medium">IATF 16949 / ISO 9001:2015 Certified Plant</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-400">GSTIN: {company.gstin || '33AAECS1234F1Z5'}</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href={`tel:${company.phone_primary}`} className="flex items-center space-x-1.5 hover:text-brand-orange transition-colors">
              <Phone className="w-3.5 h-3.5 text-brand-orange" />
              <span>{company.phone_primary || '+91 99418 20000'}</span>
            </a>
            <a href={`mailto:${company.email_sales}`} className="flex items-center space-x-1.5 hover:text-brand-orange transition-colors">
              <Mail className="w-3.5 h-3.5 text-brand-orange" />
              <span>{company.email_sales || 'sales@srisakthiindustries.com'}</span>
            </a>
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1 text-slate-400 hover:text-amber-400 font-medium transition-colors bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800"
            >
              <Cog className="w-3 h-3 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`transition-all duration-300 px-4 sm:px-8 ${
        isScrolled 
          ? 'bg-steel-900/95 backdrop-blur-md shadow-2xl border-b border-slate-800/80 py-2.5' 
          : 'bg-steel-950/80 backdrop-blur-sm border-b border-slate-800/40 py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Company Name */}
          <a href="#home" className="flex items-center space-x-3 group">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.company_name || 'Sri Sakthi Industries'}
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-md rounded transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/logo300 x 100.png';
                }}
              />
            ) : (
              <div className="h-11 w-11 rounded-lg bg-gradient-to-tr from-brand-orange to-amber-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-brand-orange/30">
                SSI
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-brand-orange transition-colors">
                {company.company_name || 'Sri Sakthi Industries'}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider uppercase -mt-0.5">
                Precision Mechanical Engineering
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-7">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onOpenQuote}
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white transition-all bg-gradient-to-r from-brand-orange to-amber-500 rounded-lg shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 hover:from-brand-darkOrange hover:to-brand-orange active:scale-95"
            >
              <span>Instant RFQ</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={onOpenQuote}
              className="px-3 py-1.5 text-xs font-bold bg-brand-orange text-white rounded-md"
            >
              RFQ
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-steel-900 border-b border-slate-800 px-6 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-200 hover:text-brand-orange font-medium text-base py-1"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-3 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-lg text-center"
            >
              Request Drawing / Instant RFQ
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 bg-slate-800 text-slate-300 font-medium rounded-lg text-center text-sm flex items-center justify-center space-x-2"
            >
              <Cog className="w-4 h-4 text-amber-400" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

