import React, { useState } from 'react';
import {
  LayoutDashboard, Building, Sparkles, Layers, Cpu, Mail,
  Receipt, Server, ExternalLink, LogOut, ShieldCheck, Menu, X
} from 'lucide-react';

import AdminDashboard from './AdminDashboard';
import CompanySettings from './CompanySettings';
import ContentEditor from './ContentEditor';
import ProductsManager from './ProductsManager';
import MachineryManager from './MachineryManager';
import InquiriesManager from './InquiriesManager';
import BillingManager from './BillingManager';
import PgAdminGuide from './PgAdminGuide';

export default function AdminLayout({ adminUser, company, hero, about, onExitAdmin, onLogout, onContentRefresh }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'company', label: 'Company & Logo CMS', icon: Building },
    { id: 'content', label: 'Hero & Content CMS', icon: Sparkles },
    { id: 'products', label: 'Products & Services', icon: Layers },
    { id: 'machinery', label: 'Machine Shop Fleet', icon: Cpu },
    { id: 'inquiries', label: 'RFQ Inquiries CRM', icon: Mail },
    { id: 'billing', label: 'Billing & Invoicing', icon: Receipt },
    { id: 'pgadmin', label: 'pgAdmin & PostgreSQL', icon: Server },
  ];

  return (
    <div className="min-h-screen bg-steel-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-steel-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-3">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.company_name}
                className="h-8 w-auto object-contain filter drop-shadow rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/logo300 x 100.png';
                }}
              />
            ) : (
              <div className="h-8 w-8 rounded bg-brand-orange flex items-center justify-center font-black text-white text-xs">
                SSI
              </div>
            )}
            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
              {company.company_name || 'Sri Sakthi Industries'}
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
              Admin CMS Console
            </span>
          </div>
        </div>

        {/* Right Admin Info & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onExitAdmin}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-orange" />
            <span className="hidden sm:inline">View Live Website</span>
          </button>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{adminUser?.username || 'admin'}</span>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-30 w-64 bg-steel-900 border-r border-slate-800 flex flex-col justify-between pt-16 md:pt-0 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 space-y-1">
            <div className="text-[11px] font-mono uppercase text-slate-500 tracking-wider px-3 mb-2 font-bold">
              Navigation
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Database Info Widget at Bottom of Sidebar */}
          <div className="p-4 m-4 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] space-y-1 font-mono text-slate-400">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>PostgreSQL 18 Local</span>
            </div>
            <div>DB: <span className="text-white">srisakthi_db</span></div>
            <div>Port: <span className="text-brand-orange">5433</span> / 5432</div>
            <div>User: <span className="text-white">postgres</span></div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-steel-950">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <AdminDashboard onNavigate={setActiveTab} company={company} />
            )}
            {activeTab === 'company' && (
              <CompanySettings initialCompany={company} onUpdate={onContentRefresh} />
            )}
            {activeTab === 'content' && (
              <ContentEditor initialHero={hero} initialAbout={about} onHeroUpdate={onContentRefresh} onAboutUpdate={onContentRefresh} />
            )}
            {activeTab === 'products' && (
              <ProductsManager onRefreshContent={onContentRefresh} />
            )}
            {activeTab === 'machinery' && (
              <MachineryManager onRefreshContent={onContentRefresh} />
            )}
            {activeTab === 'inquiries' && (
              <InquiriesManager />
            )}
            {activeTab === 'billing' && (
              <BillingManager company={company} />
            )}
            {activeTab === 'pgadmin' && (
              <PgAdminGuide />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

