import React from 'react';
import { Car, Plane, Factory, Activity, Check } from 'lucide-react';

export default function Industries() {
  const industries = [
    {
      icon: Car,
      name: 'Automotive Tier-1 & OEMs',
      desc: 'High-volume production of steering columns, drive shafts, brake calipers, fuel rail adapters, and suspension bushings with full PPAP Level 3 documentation.',
      items: ['Powertrain Components', 'Steering Knuckles', 'Suspension Bushings', 'IATF 16949 Audited']
    },
    {
      icon: Plane,
      name: 'Aerospace & Defense',
      desc: 'Precision 5-Axis VMC milling and turning of exotic alloys (SS 17-4PH, Inconel 718, Titanium Grade 5, Aluminum 7075-T6) for mission-critical assemblies.',
      items: ['Airframe Structural Brackets', 'Radar Waveguide Mounts', 'Missile Shell Spacers', 'AS9100 Process Align']
    },
    {
      icon: Factory,
      name: 'Heavy Engineering & Hydraulics',
      desc: 'High-torque mechanical components, hydraulic cylinder manifold blocks, heavy power press tooling, and large-diameter flanges.',
      items: ['Hydraulic Manifolds', 'Industrial Gear Blanks', 'Forged Flange Turning', 'Hardened Wear Sleeves']
    },
    {
      icon: Activity,
      name: 'Medical & Instrumentation',
      desc: 'Micro-precision Swiss-type turned stainless steel sensor housings, fluid control valves, and analytical instrument fittings.',
      items: ['SS316L Sensor Housings', 'Medical Valve Bodies', 'Zero-Burr Micro Finishing', 'Ultrasonic Cleaned']
    }
  ];

  return (
    <section id="industries" className="py-24 bg-steel-950 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3.5 py-1.5 rounded-full border border-brand-orange/20">
            <span>Market Verticals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Industries Powered By Sri Sakthi Engineering
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Trusted by tier-1 manufacturers and defense contractors for dimensional repeatability and reliable supply chains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div
                key={idx}
                className="bg-steel-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-orange/40 transition-all shadow-lg"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-brand-orange mb-5 border border-slate-800">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{ind.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">{ind.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {ind.items.map((item, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

