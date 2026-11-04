import React from 'react';
import { Target, Compass, Building2, Users2, ShieldCheck, Microscope, Zap, Layers } from 'lucide-react';

export default function About({ about, company }) {
  const pillars = [
    {
      icon: Microscope,
      title: 'Sub-Micron Metrology',
      desc: 'Equipped with Mitutoyo 3D CNC Coordinate Measuring Machines (CMM) and digital SPC calipers ensuring Cp/Cpk > 1.67.'
    },
    {
      icon: ShieldCheck,
      title: '100% Heat-Number Traceability',
      desc: 'Rigorous chain-of-custody tracking raw material mill test certificates (MTC) through machining, heat treatment, and dispatch.'
    },
    {
      icon: Zap,
      title: 'Continuous 24/7 Production',
      desc: 'Dual-shift operation across multi-axis CNC Turning, VMC Milling, and high-speed Traub automatic lathes.'
    },
    {
      icon: Layers,
      title: 'Turnkey Manufacturing',
      desc: 'End-to-end capabilities spanning raw casting procurement, precision CNC machining, tooling, hardening, and surface plating.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-steel-900/60 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3.5 py-1.5 rounded-full border border-brand-orange/20">
            <span>{about.section_title || 'About Sri Sakthi Industries'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {about.headline || 'Engineered For Extreme Performance & Total Traceability'}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-orange to-amber-500 mx-auto rounded-full"></div>
        </div>

        {/* Narrative & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed text-base sm:text-lg">
            <p>
              {about.description_para1 || 'Founded with a dedication to mechanical mastery, Sri Sakthi Industries operates modern precision machining, stamping, and fabrication facilities. We bridge complex blueprint specifications into production-scale reality with uncompromising repeatability.'}
            </p>
            <p className="text-slate-400 text-sm sm:text-base">
              {about.description_para2 || 'Equipped with Japanese and Korean multi-axis CNC Turning Centers, high-speed VMC milling stations, automatic Traub lathes, and Mitutoyo 3D Coordinate Measuring Machines (CMM), we satisfy demanding IATF 16949 and PPAP Level 3 audit criteria.'}
            </p>

            {/* Facility & Strength Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-steel-950/80 border border-slate-800">
                <div className="p-2.5 rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase font-mono">Infrastructure</div>
                  <div className="font-bold text-white text-sm sm:text-base">
                    {about.facility_area || '35,000 Sq. Ft. Manufacturing Plant'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-steel-950/80 border border-slate-800">
                <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
                  <Users2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase font-mono">Workforce</div>
                  <div className="font-bold text-white text-sm sm:text-base">
                    {about.machinist_strength || '120+ Dedicated Engineers & Machinists'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-steel-950 to-steel-900 border border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/15 transition-all"></div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-brand-orange/15 text-brand-orange">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {about.mission || 'To empower global manufacturing with uncompromised precision, rapid turnaround, and zero-defect components through lean manufacturing and automated quality gates.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-steel-950 to-steel-900 border border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/15 transition-all"></div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {about.vision || 'To be the preferred precision mechanical engineering and contract manufacturing partner recognized worldwide for technical innovation, sustainable practices, and quality leadership.'}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-brand-orange mb-4 border border-slate-800">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

