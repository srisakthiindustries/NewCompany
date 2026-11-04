import React, { useState } from 'react';
import { Save, Upload, Building, Phone, Mail, FileText, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';

export default function CompanySettings({ initialCompany, onUpdate }) {
  const [form, setForm] = useState(initialCompany || {});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const res = await api.uploadImage(file);
      setForm(prev => ({ ...prev, logo_url: res.url }));
      setStatusMsg({ type: 'success', text: 'Logo uploaded successfully! Click "Save Changes" to apply.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to upload logo' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const res = await api.updateCompany(form);
      setStatusMsg({ type: 'success', text: 'Company profile and branding saved to PostgreSQL!' });
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update company settings' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Company Identity & Branding CMS</h2>
          <p className="text-xs text-slate-400 font-mono">
            Changes made here update the live website header, footer, tax invoices, and metadata in real-time.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-brand-orange/20 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving to Database...' : 'Save Changes'}</span>
        </button>
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Logo & Company Name */}
        <div className="bg-steel-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-2.5 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-brand-orange" />
            <span>Primary Brand Identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Logo Preview & Upload */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-dashed border-slate-700 text-center">
              <span className="text-xs font-mono text-slate-400 mb-3">Live Logo Preview</span>
              <div className="h-20 w-full flex items-center justify-center bg-slate-900/60 rounded-lg p-2 mb-4 border border-slate-800">
                {form.logo_url ? (
                  <img
                    src={form.logo_url}
                    alt="Logo Preview"
                    className="max-h-16 max-w-full object-contain filter drop-shadow"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/logo300 x 100.png';
                    }}
                  />
                ) : (
                  <div className="text-slate-500 text-xs flex items-center space-x-1">
                    <ImageIcon className="w-4 h-4" />
                    <span>No logo loaded</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="w-full space-y-2">
                <label className="cursor-pointer inline-flex items-center justify-center space-x-2 w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Upload New Logo Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <div className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP, SVG (Transparent background recommended)</div>
              </div>
            </div>

            {/* Inputs: Name, Tagline, URL */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company Official Name *
                </label>
                <input
                  type="text"
                  required
                  name="company_name"
                  value={form.company_name || ''}
                  onChange={handleChange}
                  placeholder="Sri Sakthi Industries"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-base focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company Tagline / Subtitle
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={form.tagline || ''}
                  onChange={handleChange}
                  placeholder="Precision Mechanical Engineering, CNC Machining & High-Reliability Manufacturing"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Logo Asset Path / Web URL
                </label>
                <input
                  type="text"
                  name="logo_url"
                  value={form.logo_url || ''}
                  onChange={handleChange}
                  placeholder="/assets/logo300 x 100.png"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white font-mono text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Official Communications */}
        <div className="bg-steel-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2.5 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Commercial & Support Contact Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Phone</label>
              <input
                type="text"
                name="phone_primary"
                value={form.phone_primary || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Secondary / Alternate</label>
              <input
                type="text"
                name="phone_secondary"
                value={form.phone_secondary || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Email</label>
              <input
                type="email"
                name="email_primary"
                value={form.email_primary || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sales & RFQ Email</label>
              <input
                type="email"
                name="email_sales"
                value={form.email_sales || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Registered Address, GST & PAN */}
        <div className="bg-steel-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2.5 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Plant Address, Tax & Banking Master Data</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Address Line 1</label>
              <input
                type="text"
                name="address_line1"
                value={form.address_line1 || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Address Line 2 (Area/Corridor)</label>
              <input
                type="text"
                name="address_line2"
                value={form.address_line2 || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={form.city || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={form.state || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Postal PIN Code</label>
              <input
                type="text"
                name="postal_code"
                value={form.postal_code || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={form.country || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">GSTIN Number (for Tax Invoices)</label>
              <input
                type="text"
                name="gstin"
                value={form.gstin || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-brand-orange font-mono font-bold focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Income Tax PAN</label>
              <input
                type="text"
                name="pan"
                value={form.pan || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          {/* Bank Details for Invoicing */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-xs font-mono font-semibold text-slate-400 block mb-3">
              Official Bank Details (Printed on Invoices)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bank_name"
                  value={form.bank_name || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Account Number</label>
                <input
                  type="text"
                  name="bank_account_no"
                  value={form.bank_account_no || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">IFSC Code</label>
                <input
                  type="text"
                  name="bank_ifsc"
                  value={form.bank_ifsc || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Branch Name</label>
                <input
                  type="text"
                  name="bank_branch"
                  value={form.bank_branch || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

