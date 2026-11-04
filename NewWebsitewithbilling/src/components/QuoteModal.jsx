import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function QuoteModal({ isOpen, onClose, company }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    company_name: '',
    email: '',
    phone: '',
    service_type: 'CNC Turning & Turn-Mill',
    material_preference: 'Alloy Steel (EN8/EN19/EN24)',
    estimated_quantity: '1,000 - 5,000 Pcs',
    target_date: 'Within 30 Days',
    specifications_notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.submitInquiry(formData);
      setSuccessResult(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit quote request. Please call our sales desk.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccessResult(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-steel-950 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {successResult ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">RFQ Submitted Successfully!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thank you, <strong className="text-white">{formData.customer_name}</strong>. Your drawing review request has been assigned to our plant engineering estimators.
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-w-md mx-auto">
              <div className="text-xs text-slate-400 font-mono">Your Tracking RFQ Reference:</div>
              <div className="text-2xl font-mono font-bold text-brand-orange mt-1">
                {successResult.rfq_number}
              </div>
            </div>

            <p className="text-xs text-slate-400">
              A copy of your inquiry has been recorded in our PostgreSQL system. Our team will contact you at <span className="text-white">{formData.phone}</span> / <span className="text-white">{formData.email}</span>.
            </p>

            <div className="pt-4">
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-lg text-sm shadow-lg shadow-brand-orange/20"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <span className="text-xs font-mono font-bold text-brand-orange uppercase tracking-wider">
                Instant Request For Quotation
              </span>
              <h3 className="text-2xl font-black text-white">
                Request Engineering Quote & Drawing Review
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Submit part specifications for rapid cycle time estimation, DFM analysis, and volume job-work pricing.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center space-x-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Kannan"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="e.g. Apex Precision Systems"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="purchase@company.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98400 12345"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Manufacturing Process Needed
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value="CNC Turning & Turn-Mill">CNC Turning & Turn-Mill</option>
                    <option value="Multi-Axis VMC Milling">Multi-Axis VMC Milling</option>
                    <option value="Automatic Traub Lathe Job Work">Automatic Traub Lathe Job Work</option>
                    <option value="Sheet Metal Stamping & Dies">Sheet Metal Stamping & Dies</option>
                    <option value="Metrology & CMM Inspection">Metrology & CMM Inspection</option>
                    <option value="Complete Assembly & Heat Treatment">Complete Assembly & Heat Treatment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Raw Material Specification
                  </label>
                  <select
                    name="material_preference"
                    value={formData.material_preference}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value="Alloy Steel (EN8/EN19/EN24/EN36)">Alloy Steel (EN8/EN19/EN24/EN36)</option>
                    <option value="Stainless Steel (SS304/SS316L/17-4PH)">Stainless Steel (SS304/SS316L/17-4PH)</option>
                    <option value="Aluminum (Al 6061-T6 / 7075)">Aluminum (Al 6061-T6 / 7075)</option>
                    <option value="Brass / Copper (CuZn39Pb3)">Brass / Copper (CuZn39Pb3)</option>
                    <option value="Cast Iron (FG260 / SGI 500)">Cast Iron (FG260 / SGI 500)</option>
                    <option value="Customer Supplied Material (Job Work)">Customer Supplied Material (Job Work)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Estimated Batch / Annual Quantity
                  </label>
                  <input
                    type="text"
                    name="estimated_quantity"
                    value={formData.estimated_quantity}
                    onChange={handleChange}
                    placeholder="e.g. 5,000 Pcs / Month"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Required Delivery Schedule
                  </label>
                  <input
                    type="text"
                    name="target_date"
                    value={formData.target_date}
                    onChange={handleChange}
                    placeholder="e.g. Within 2-3 Weeks"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Drawing Details, Tolerances & Critical Notes
                </label>
                <textarea
                  rows={3}
                  name="specifications_notes"
                  value={formData.specifications_notes}
                  onChange={handleChange}
                  placeholder="Mention critical dimensions, surface finish (Ra), hardness (HRC), plating specs, or drawing numbers. Step files/PDFs can also be shared via email."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange text-xs"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Strict NDA & Drawing Confidentiality</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-darkOrange hover:to-brand-orange text-white font-bold rounded-lg text-xs shadow-lg shadow-brand-orange/20 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting...' : 'Submit RFQ'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

