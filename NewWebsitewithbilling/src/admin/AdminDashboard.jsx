import React, { useState, useEffect } from 'react';
import { Mail, Layers, Cpu, Receipt, ArrowRight, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard({ onNavigate, company }) {
  const [metrics, setMetrics] = useState({
    inquiriesCount: 0,
    productsCount: 0,
    machineryCount: 0,
    invoicesCount: 0,
    totalRevenue: 0
  });

  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [inqRes, prodRes, machRes, invRes, healthRes] = await Promise.all([
          api.getInquiries(),
          api.getServices(),
          api.getMachinery(),
          api.getInvoices(),
          api.getHealth()
        ]);

        const invoices = invRes.data || [];
        const totalRev = invoices.reduce((acc, curr) => acc + (Number(curr.grand_total) || 0), 0);

        setMetrics({
          inquiriesCount: (inqRes.data || []).length,
          productsCount: (prodRes.data || []).length,
          machineryCount: (machRes.data || []).length,
          invoicesCount: invoices.length,
          totalRevenue: totalRev
        });

        setHealth(healthRes);
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-steel-900 via-steel-900 to-steel-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-brand-orange uppercase">
            <span>Plant Management Console</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Welcome to {company.company_name || 'Sri Sakthi Industries'} Command Center
          </h2>
          <p className="text-xs text-slate-400">
            Node.js runtime connected to local PostgreSQL database <span className="font-mono text-slate-300 font-semibold">{health?.database || 'srisakthi_db'}</span> on port <span className="font-mono text-brand-orange font-bold">{health?.dbPort || 5433}</span>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('billing')}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-orange/20 transition-all flex items-center space-x-1.5"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </button>
          <button
            onClick={() => onNavigate('company')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
          >
            Edit Branding
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => onNavigate('inquiries')}
          className="bg-steel-900 border border-slate-800 hover:border-brand-orange/40 p-5 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">RFQ Inquiries</span>
            <div className="p-2 bg-brand-orange/15 text-brand-orange rounded-xl">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono group-hover:text-brand-orange transition-colors">
            {metrics.inquiriesCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending Drawing Reviews & Quotes</p>
        </div>

        <div
          onClick={() => onNavigate('products')}
          className="bg-steel-900 border border-slate-800 hover:border-sky-500/40 p-5 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Catalog Components</span>
            <div className="p-2 bg-sky-500/15 text-sky-400 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono group-hover:text-sky-400 transition-colors">
            {metrics.productsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">CNC, VMC & Traub Offerings</p>
        </div>

        <div
          onClick={() => onNavigate('machinery')}
          className="bg-steel-900 border border-slate-800 hover:border-amber-500/40 p-5 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Machinery Fleet</span>
            <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono group-hover:text-amber-400 transition-colors">
            {metrics.machineryCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Installed Mazak, Doosan & Traubs</p>
        </div>

        <div
          onClick={() => onNavigate('billing')}
          className="bg-steel-900 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Gross Tax Invoiced</span>
            <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-xl">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ₹{metrics.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{metrics.invoicesCount} Invoices in Database</p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigate('company')}
          className="p-6 rounded-2xl bg-steel-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <h3 className="font-bold text-white text-base mb-1 group-hover:text-brand-orange transition-colors">
            Update Company Name & Logo
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Change the official company name, upload high-res transparent logo, update plant SIDCO address, GSTIN and phone.
          </p>
          <span className="text-xs text-brand-orange font-bold flex items-center space-x-1">
            <span>Configure Identity</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('content')}
          className="p-6 rounded-2xl bg-steel-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <h3 className="font-bold text-white text-base mb-1 group-hover:text-sky-400 transition-colors">
            Edit Landing Hero & Narrative
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Edit main headlines, sub-headlines, key metric counters (years of experience, ±0.005mm accuracy), and mission/vision.
          </p>
          <span className="text-xs text-sky-400 font-bold flex items-center space-x-1">
            <span>Edit Content</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('pgadmin')}
          className="p-6 rounded-2xl bg-steel-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <h3 className="font-bold text-white text-base mb-1 group-hover:text-amber-400 transition-colors">
            PostgreSQL & pgAdmin 4 Access
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Direct host and port connection credentials (password <code>Beon@994182</code>) to connect pgAdmin 4 to the live database.
          </p>
          <span className="text-xs text-amber-400 font-bold flex items-center space-x-1">
            <span>View pgAdmin Credentials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

