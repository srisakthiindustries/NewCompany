import React from 'react';
import { Cpu, Gauge, Layers, Wrench, ShieldAlert } from 'lucide-react';

export default function Machinery({ machinery = [] }) {
  return (
    <section id="machinery" className="py-24 bg-steel-900/50 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-3.5 py-1.5 rounded-full border border-sky-500/20">
            <span>Machine Shop Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            High-Rigidity CNC Machinery & 3D Metrology Lab
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Equipped with Japanese & Korean turning-milling centers, automatic Traub lathes, and Mitutoyo CMMs for non-stop precision operations.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-brand-orange mx-auto rounded-full"></div>
        </div>

        {/* Machines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machinery.map((m) => (
            <div
              key={m.id}
              className="bg-steel-950/90 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all shadow-xl group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-900 text-sky-400 border border-slate-800">
                    {m.category}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                    Qty: {m.quantity} Units
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">
                  {m.machine_name}
                </h3>
                <div className="text-xs text-slate-400 font-mono mb-4">{m.make_model}</div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-start space-x-2">
                    <Layers className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-400">Capacity: </span>
                      <span className="text-slate-200 font-medium">{m.capacity}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Gauge className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-400">Accuracy Gate: </span>
                      <span className="text-emerald-400 font-mono font-medium">{m.accuracy}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Preventive TPM: Daily</span>
                <span className="text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Operational</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

