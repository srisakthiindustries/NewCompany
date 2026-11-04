import React, { useState } from 'react';
import { Save, Sparkles, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function ContentEditor({ initialHero, initialAbout, onHeroUpdate, onAboutUpdate }) {
  const [heroForm, setHeroForm] = useState(initialHero || {});
  const [aboutForm, setAboutForm] = useState(initialAbout || {});
  const [loadingHero, setLoadingHero] = useState(false);
  const [loadingAbout, setLoadingAbout] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleHeroChange = (e) => {
    setHeroForm({ ...heroForm, [e.target.name]: e.target.value });
  };

  const handleAboutChange = (e) => {
    setAboutForm({ ...aboutForm, [e.target.name]: e.target.value });
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    setLoadingHero(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const res = await api.updateHero(heroForm);
      setStatusMsg({ type: 'success', text: 'Hero banner content updated successfully in PostgreSQL!' });
      if (onHeroUpdate) onHeroUpdate(res.data);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update hero content' });
    } finally {
      setLoadingHero(false);
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setLoadingAbout(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const res = await api.updateAbout(aboutForm);
      setStatusMsg({ type: 'success', text: 'About section narrative updated successfully in PostgreSQL!' });
      if (onAboutUpdate) onAboutUpdate(res.data);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update about content' });
    } finally {
      setLoadingAbout(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Website Content & Narrative CMS</h2>
        <p className="text-xs text-slate-400 font-mono">
          Modify hero headlines, key performance counters, mission, and vision statements.
        </p>
      </div>

      {statusMsg.text && (
        <div className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
          statusMsg.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Hero Content Section */}
      <div className="bg-steel-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5 text-sm font-bold text-white">
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span>Landing Hero Section Content</span>
          </div>
          <button
            onClick={handleSaveHero}
            disabled={loadingHero}
            className="inline-flex items-center space-x-2 px-5 py-2 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-lg text-xs transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{loadingHero ? 'Saving...' : 'Save Hero'}</span>
          </button>
        </div>

        <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Badge Text (Top Pill)</label>
            <input
              type="text"
              name="badge_text"
              value={heroForm.badge_text || ''}
              onChange={handleHeroChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Main Headline *</label>
            <textarea
              rows={2}
              name="headline"
              value={heroForm.headline || ''}
              onChange={handleHeroChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-brand-orange"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Subheadline / Supporting Narrative</label>
            <textarea
              rows={3}
              name="subheadline"
              value={heroForm.subheadline || ''}
              onChange={handleHeroChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-orange"
            ></textarea>
          </div>

          {/* 4 Counters */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs font-mono font-semibold text-slate-400 block mb-3">
              Hero KPI Metric Counters
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <label className="block text-[11px] text-slate-400">Stat 1 (Value / Label)</label>
                <input
                  type="text"
                  name="stat1_value"
                  value={heroForm.stat1_value || ''}
                  onChange={handleHeroChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-brand-orange font-bold font-mono text-sm"
                />
                <input
                  type="text"
                  name="stat1_label"
                  value={heroForm.stat1_label || ''}
                  onChange={handleHeroChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <label className="block text-[11px] text-slate-400">Stat 2 (Value / Label)</label>
                <input
                  type="text"
                  name="stat2_value"
                  value={heroForm.stat2_value || ''}
                  onChange={handleHeroChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sky-400 font-bold font-mono text-sm"
                />
                <input
                  type="text"
                  name="stat2_label"
                  value={heroForm.stat2_label || ''}
                  onChange={handleHeroChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <label className="block text-[11px] text-slate-400">Stat 3 (Value / Label)</label>
                <input
                  type="text"
                  name="stat3_value"
                  value={heroForm.stat3_value || ''}
                  onChange={handleHeroChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-400 font-bold font-mono text-sm"
                />
                <input
                  type="text"
                  name="stat3_label"
                  value={heroForm.stat3_label || ''}
                  onChange={handleHeroChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <label className="block text-[11px] text-slate-400">Stat 4 (Value / Label)</label>
                <input
                  type="text"
                  name="stat4_value"
                  value={heroForm.stat4_value || ''}
                  onChange={handleHeroChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-amber-400 font-bold font-mono text-sm"
                />
                <input
                  type="text"
                  name="stat4_label"
                  value={heroForm.stat4_label || ''}
                  onChange={handleHeroChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* About Content Section */}
      <div className="bg-steel-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5 text-sm font-bold text-white">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Company Profile & Narrative Content</span>
          </div>
          <button
            onClick={handleSaveAbout}
            disabled={loadingAbout}
            className="inline-flex items-center space-x-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{loadingAbout ? 'Saving...' : 'Save Narrative'}</span>
          </button>
        </div>

        <form onSubmit={handleSaveAbout} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Section Title</label>
              <input
                type="text"
                name="section_title"
                value={aboutForm.section_title || ''}
                onChange={handleAboutChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Headline</label>
              <input
                type="text"
                name="headline"
                value={aboutForm.headline || ''}
                onChange={handleAboutChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Company Story Paragraph 1</label>
            <textarea
              rows={3}
              name="description_para1"
              value={aboutForm.description_para1 || ''}
              onChange={handleAboutChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-orange leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Company Story Paragraph 2</label>
            <textarea
              rows={3}
              name="description_para2"
              value={aboutForm.description_para2 || ''}
              onChange={handleAboutChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-orange leading-relaxed"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mission Statement</label>
              <textarea
                rows={3}
                name="mission"
                value={aboutForm.mission || ''}
                onChange={handleAboutChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-orange"
              ></textarea>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Vision Statement</label>
              <textarea
                rows={3}
                name="vision"
                value={aboutForm.vision || ''}
                onChange={handleAboutChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-orange"
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

