import React from 'react';
import { ShieldCheck, Cog, ArrowUp, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ company, onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-steel-950 border-t border-slate-800 text-slate-400 text-xs pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Company Brand Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.company_name}
                  className="h-10 w-auto object-contain filter drop-shadow rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/logo300 x 100.png';
                  }}
                />
              ) : (
                <div className="h-10 w-10 rounded bg-gradient-to-tr from-brand-orange to-amber-500 flex items-center justify-center font-black text-white text-lg">
                  SSI
                </div>
              )}
              <span className="text-xl font-black text-white tracking-tight">
                {company.company_name || 'Sri Sakthi Industries'}
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              {company.about_short || 'Premier mechanical engineering enterprise specializing in precision CNC turning, multi-axis VMC milling, stamping, and IATF-compliant components.'}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-slate-900 rounded border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ISO 9001:2015</span>
              </span>
              <span className="px-2.5 py-1 bg-slate-900 rounded border border-slate-800 text-[11px] font-mono text-sky-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>IATF 16949 Compliant</span>
              </span>
              <span className="px-2.5 py-1 bg-slate-900 rounded border border-slate-800 text-[11px] font-mono text-amber-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>PPAP Level 3</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
              Engineering Links
            </h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-brand-orange transition-colors">Home & Capabilities</a></li>
              <li><a href="#about" className="hover:text-brand-orange transition-colors">Company Profile & Quality</a></li>
              <li><a href="#services" className="hover:text-brand-orange transition-colors">CNC & VMC Component Catalog</a></li>
              <li><a href="#machinery" className="hover:text-brand-orange transition-colors">Mazak & Doosan Machine Shop</a></li>
              <li><a href="#industries" className="hover:text-brand-orange transition-colors">Automotive & Aerospace Verticals</a></li>
              <li><a href="#contact" className="hover:text-brand-orange transition-colors">Plant Location & Logistics</a></li>
            </ul>
          </div>

          {/* Works & Compliance */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
              Registered Works & Contact
            </h5>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-brand-orange mt-0.5 shrink-0" />
                <span>{company.address_line1}, {company.city} - {company.postal_code}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span>{company.phone_primary} / {company.phone_secondary}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span>{company.email_sales}</span>
              </div>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                GSTIN: {company.gstin} | PAN: {company.pan}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            {company.footer_text || '© 2026 Sri Sakthi Industries (srisakthiindustries.com). All Rights Reserved.'}
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-amber-400 flex items-center space-x-1 transition-colors"
            >
              <Cog className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Control Panel</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

