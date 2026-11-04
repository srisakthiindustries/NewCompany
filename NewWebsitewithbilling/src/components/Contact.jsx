import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Contact({ company, onOpenQuote }) {
  const cleanPhone = (company.phone_primary || '9941820000').replace(/[^0-9]/g, '');

  return (
    <section id="contact" className="py-24 bg-steel-900/60 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3.5 py-1.5 rounded-full border border-brand-orange/20">
            <span>Plant Location & Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect With Our Engineering Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Visit our manufacturing facility in the Chennai industrial zone or get in touch directly with our commercial team.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-orange to-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Cards: Contact Info & Action Buttons */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address Card */}
            <div className="bg-steel-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-brand-orange/15 text-brand-orange shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Manufacturing Works & Works Office</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {company.address_line1 || 'Plot No. 42 & 43, SIDCO Industrial Estate'}<br />
                  {company.address_line2 || 'Ambattur / Sriperumbudur Industrial Corridor'}<br />
                  {company.city || 'Chennai'}, {company.state || 'Tamil Nadu'} - {company.postal_code || '600058'}, {company.country || 'India'}
                </p>
                <div className="mt-2 text-[11px] font-mono text-slate-400">
                  GSTIN: <span className="text-white font-medium">{company.gstin || '33AAECS1234F1Z5'}</span>
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="bg-steel-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Commercial & Technical Support</h4>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-400">Phone: </span>
                    <a href={`tel:${company.phone_primary}`} className="text-white hover:text-brand-orange font-medium">
                      {company.phone_primary || '+91 99418 20000'}
                    </a>
                  </div>
                  {company.phone_secondary && (
                    <div>
                      <span className="text-slate-400">Alternate: </span>
                      <a href={`tel:${company.phone_secondary}`} className="text-white hover:text-brand-orange font-medium">
                        {company.phone_secondary}
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">Technical RFQ: </span>
                    <a href={`mailto:${company.email_sales}`} className="text-white hover:text-brand-orange font-medium">
                      {company.email_sales || 'sales@srisakthiindustries.com'}
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=Hello%20Sri%20Sakthi%20Industries,%20I%20would%20like%20to%20request%20a%20quote%20for%20machining%20parts.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp RFQ</span>
                  </a>

                  <button
                    onClick={onOpenQuote}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-darkOrange text-white text-xs font-bold transition-colors"
                  >
                    <span>Instant Quote</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-steel-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-sky-500/15 text-sky-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Shift Hours & Dispatch</h4>
                <p className="text-xs text-slate-300">
                  {company.working_hours || 'Mon - Sat: 8:30 AM - 6:30 PM (Machining Units 24/7)'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Incoming Raw Material Receiving: 8:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Right Map & Plant Facility View */}
          <div className="lg:col-span-7 bg-steel-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">Plant Geographic Connectivity</h4>
                <p className="text-xs text-slate-400">
                  Strategically situated in Chennai industrial corridor adjacent to major automotive OEM hubs (Hyundai, Daimler, Ford, Renault-Nissan, Ashok Leyland).
                </p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 rounded-md border border-emerald-500/20 whitespace-nowrap">
                Gate 1 & 2 Open
              </span>
            </div>

            <div className="relative h-72 sm:h-80 w-full bg-slate-900">
              <iframe
                title="Sri Sakthi Industries Plant Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62181.71649982404!2d80.12643534570691!3d13.076629918237936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5263a2a6288ea1%3A0x6b4cf8f830342a1!2sSIDCO%20Industrial%20Estate%2C%20Ambattur%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 filter invert-[90%] hue-rotate-180 contrast-125"
                loading="lazy"
              ></iframe>
            </div>

            <div className="p-4 bg-slate-950/90 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="font-mono">Logistics: Close proximity to Chennai Sea Port (25 km) & Airport (18 km)</span>
              <a
                href="https://maps.google.com/?q=SIDCO+Industrial+Estate+Ambattur+Chennai"
                target="_blank"
                rel="noreferrer"
                className="text-brand-orange hover:underline inline-flex items-center space-x-1 font-medium"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

