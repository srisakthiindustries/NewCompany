import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, User, Search, Trash2, Edit3, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('New');

  useEffect(() => {
    loadInquiries();
  }, [statusFilter, search]);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.getInquiries({ status: statusFilter, search });
      setInquiries(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (inq) => {
    setSelectedInquiry(inq);
    setNewStatus(inq.status || 'New');
    setAdminNotes(inq.admin_notes || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedInquiry) return;
    try {
      await api.updateInquiryStatus(selectedInquiry.id, newStatus, adminNotes);
      setSelectedInquiry(null);
      loadInquiries();
    } catch (err) {
      alert(err.message || 'Failed to update inquiry');
    }
  };

  const handleDelete = async (id, rfq) => {
    if (!window.confirm(`Delete RFQ inquiry ${rfq}?`)) return;
    try {
      await api.deleteInquiry(id);
      loadInquiries();
    } catch (err) {
      alert(err.message || 'Failed to delete inquiry');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-brand-orange/15 text-brand-orange border-brand-orange/30';
      case 'In Review': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Quoted': return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Approved': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">RFQ Inquiries & Lead CRM</h2>
          <p className="text-xs text-slate-400 font-mono">
            Client requests for quotations, specifications, drawing submissions, and batch estimations.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search RFQ, name, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Quoted">Quoted</option>
            <option value="Approved">Approved</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Loading RFQs from PostgreSQL...</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">No RFQ inquiries found matching criteria.</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-steel-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-brand-orange text-sm">{inq.rfq_number}</span>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(inq.status)}`}>
                    {inq.status}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(inq.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
                  <div className="flex items-center space-x-1.5 text-white font-bold">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{inq.customer_name}</span>
                    <span className="text-slate-400 font-normal">({inq.company_name})</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <a href={`tel:${inq.phone}`} className="hover:text-brand-orange">{inq.phone}</a>
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <a href={`mailto:${inq.email}`} className="hover:text-brand-orange">{inq.email}</a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 font-mono">Process: </span>
                    <span className="text-slate-200 font-medium">{inq.service_type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono">Material: </span>
                    <span className="text-slate-200 font-medium">{inq.material_preference}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono">Quantity: </span>
                    <span className="text-emerald-400 font-medium">{inq.estimated_quantity}</span>
                  </div>
                </div>

                {inq.specifications_notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded">
                    "{inq.specifications_notes}"
                  </p>
                )}

                {inq.admin_notes && (
                  <div className="text-[11px] text-amber-300/90 font-mono bg-amber-500/10 p-2 rounded border border-amber-500/20">
                    <strong>Admin Note:</strong> {inq.admin_notes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col items-center justify-end space-x-2 lg:space-x-0 lg:space-y-2 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-4">
                <button
                  onClick={() => handleOpenEdit(inq)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update</span>
                </button>

                <button
                  onClick={() => handleDelete(inq.id, inq.rfq_number)}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Status Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-steel-950 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              Update RFQ: {selectedInquiry.rfq_number}
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-orange"
              >
                <option value="New">New</option>
                <option value="In Review">In Review</option>
                <option value="Quoted">Quoted</option>
                <option value="Approved">Approved</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Internal Admin Notes</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Quoted ₹350/pc for 2500 batch. Drawing approved by plant manager."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-orange"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-5 py-2 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-lg text-xs"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

