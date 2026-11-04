import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Cpu, Award, FileSpreadsheet } from 'lucide-react';

export default function Hero({ hero, company, onOpenQuote }) {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-mesh">
      {/* Background Graphic & Accent Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-blue/10 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-orange/40 text-brand-orange shadow-lg shadow-brand-orange/10">
              <ShieldCheck className="w-4 h-4 text-brand-orange animate-pulse" />
              <span className="text-xs font-semibold tracking-wide uppercase font-mono">
                {hero.badge_text || 'IATF 16949 & ISO 9001:2015 Precision Machine Shop'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              {hero.headline || 'Ultra-Tight Tolerance CNC Machining & Mechanical Manufacturing'}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
              {hero.subheadline || 'Delivering micron-level accuracy (±0.005mm) for automotive OEMs, defense contractors, and heavy engineering with guaranteed zero-defect batch traceability.'}
            </p>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs font-medium text-slate-300">
              <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sub-Micron Probing (Mitutoyo CMM)</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>PPAP Level 3 & AIAG Compliant</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>24/7 CNC & Automatic Traub Fleet</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-bold text-white transition-all bg-gradient-to-r from-brand-orange to-amber-500 rounded-xl shadow-xl shadow-brand-orange/30 hover:shadow-brand-orange/50 hover:from-brand-darkOrange hover:to-brand-orange active:scale-95"
              >
                <span>{hero.primary_cta_text || 'Request Instant RFQ'}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <a
                href={hero.secondary_cta_link || '#services'}
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-slate-200 transition-all bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl hover:text-white"
              >
                <span>{hero.secondary_cta_text || 'Explore Capabilities'}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Industrial Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-orange via-sky-500 to-amber-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

              {/* Main Machine Card */}
              <div className="relative rounded-2xl bg-steel-900/90 border border-slate-700/80 p-5 shadow-2xl overflow-hidden">
                <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-950 mb-4 group">
                  <img
                    src={hero.bg_image_url || '/assets/backgroundcnc.jpg'}
                    alt="CNC Machining Shop Floor"
                    className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/backgroundcnc.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-steel-950 via-transparent to-transparent"></div>
                  
                  {/* Floating Live Telemetry Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800 text-xs">
                    <span className="flex items-center space-x-2 text-slate-300 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>ACTIVE RUN: SPINDLE 12,000 RPM</span>
                    </span>
                    <span className="text-brand-orange font-mono font-bold">±0.005mm</span>
                  </div>
                </div>

                {/* Machine Highlights Mini-Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block mb-0.5">Primary Facility</span>
                    <span className="font-bold text-slate-100">SIDCO Ambattur, Chennai</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block mb-0.5">Metrology Station</span>
                    <span className="font-bold text-slate-100">Mitutoyo 3D CMM Lab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic 4-KPI Counter Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="p-4 rounded-xl bg-steel-900/40 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-orange font-mono">
                {hero.stat1_value || '25+'}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {hero.stat1_label || 'Years Manufacturing Excellence'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-steel-900/40 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-400 font-mono">
                {hero.stat2_value || '±0.005 mm'}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {hero.stat2_label || 'Sub-Micron Precision Gate'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-steel-900/40 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                {hero.stat3_value || '99.8%'}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {hero.stat3_label || 'On-Time Dispatch Rate'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-steel-900/40 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                {hero.stat4_value || '500K+'}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {hero.stat4_label || 'Components Delivered Monthly'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

