import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, SlidersHorizontal, Info, Shield, X } from 'lucide-react';

export default function Services({ services = [], onOpenQuote }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const categories = ['All', ...new Set(services.map(s => s.category).filter(Boolean))];

  const filtered = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <section id="services" className="py-24 bg-steel-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
              <span>Manufacturing Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Precision Engineering Services & Products
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Turnkey machining, mass job-work production, stamping, and metallurgical surface treatment conforming to IATF 16949 standards.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <button
              onClick={onOpenQuote}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-brand-orange hover:text-white border border-brand-orange/40 text-sm font-bold transition-all"
            >
              <span>Submit Custom Blueprint</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/25'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services / Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => {
            let specs = [];
            try {
              specs = typeof item.specifications === 'string'
                ? JSON.parse(item.specifications)
                : (item.specifications || []);
            } catch (e) {
              specs = [];
            }

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image_url || '/assets/backgroundcnc.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/backgroundcnc.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-900 via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md text-brand-orange border border-brand-orange/30">
                      {item.category}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.summary || item.description}
                    </p>

                    {/* Quick Specs Snippet */}
                    {specs.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        {specs.slice(0, 3).map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400 font-mono">{s.label}:</span>
                            <span className="text-slate-200 font-medium truncate max-w-[180px]">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveModalItem(item)}
                    className="flex-1 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-center"
                  >
                    Specifications
                  </button>
                  <button
                    onClick={onOpenQuote}
                    className="flex-1 py-2 text-xs font-bold bg-brand-orange hover:bg-brand-darkOrange text-white rounded-lg transition-all text-center flex items-center justify-center space-x-1"
                  >
                    <span>Request Quote</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specifications Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-steel-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono font-bold text-brand-orange uppercase tracking-wider">
              {activeModalItem.category}
            </span>
            <h3 className="text-2xl font-black text-white mt-1 mb-4">
              {activeModalItem.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {activeModalItem.description || activeModalItem.summary}
            </p>

            <div className="bg-steel-950 rounded-xl p-4 border border-slate-800 mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                Technical Specifications & Standards
              </h4>
              <div className="space-y-2">
                {(() => {
                  let specs = [];
                  try {
                    specs = typeof activeModalItem.specifications === 'string'
                      ? JSON.parse(activeModalItem.specifications)
                      : (activeModalItem.specifications || []);
                  } catch (e) {
                    specs = [];
                  }
                  if (specs.length === 0) {
                    return <div className="text-xs text-slate-500 italic">No specific specifications added. Contact our engineering desk.</div>;
                  }
                  return specs.map((s, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-800/60 text-xs">
                      <span className="text-slate-400 font-mono">{s.label}</span>
                      <span className="text-white font-medium">{s.value}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModalItem(null);
                  onOpenQuote();
                }}
                className="px-6 py-2 text-xs font-bold bg-brand-orange hover:bg-brand-darkOrange text-white rounded-lg shadow-lg shadow-brand-orange/20"
              >
                Get Quote For This Part
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

