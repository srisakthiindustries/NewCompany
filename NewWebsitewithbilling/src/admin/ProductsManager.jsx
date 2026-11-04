import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Image as ImageIcon, Upload } from 'lucide-react';
import { api } from '../services/api';

export default function ProductsManager({ onRefreshContent }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const defaultForm = {
    title: '',
    category: 'CNC Machining',
    summary: '',
    description: '',
    specifications: [
      { label: 'Max Turning Diameter', value: '450 mm' },
      { label: 'Tolerance', value: '±0.005 mm' }
    ],
    image_url: '/assets/backgroundcnc.jpg',
    sort_order: 1,
    is_active: true
  };

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getServices();
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setForm(defaultForm);
    setEditingItem(null);
    setIsNewModalOpen(true);
  };

  const openEditModal = (item) => {
    let specs = [];
    try {
      specs = typeof item.specifications === 'string'
        ? JSON.parse(item.specifications)
        : (item.specifications || []);
    } catch (e) {
      specs = [];
    }
    setForm({
      ...item,
      specifications: specs.length ? specs : [{ label: 'Tolerance', value: '±0.005 mm' }]
    });
    setEditingItem(item);
    setIsNewModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      setForm(prev => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSpecRow = () => {
    setForm({
      ...form,
      specifications: [...form.specifications, { label: '', value: '' }]
    });
  };

  const handleSpecChange = (index, field, val) => {
    const updated = [...form.specifications];
    updated[index][field] = val;
    setForm({ ...form, specifications: updated });
  };

  const handleRemoveSpecRow = (index) => {
    const updated = form.specifications.filter((_, i) => i !== index);
    setForm({ ...form, specifications: updated });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateService(editingItem.id, form);
        setStatusMsg({ type: 'success', text: `Product "${form.title}" updated!` });
      } else {
        await api.createService(form);
        setStatusMsg({ type: 'success', text: `Product "${form.title}" created!` });
      }
      setIsNewModalOpen(false);
      loadProducts();
      if (onRefreshContent) onRefreshContent();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteService(id);
      setStatusMsg({ type: 'success', text: `Product "${title}" deleted.` });
      loadProducts();
      if (onRefreshContent) onRefreshContent();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Services & Product Catalog Manager</h2>
          <p className="text-xs text-slate-400 font-mono">
            Manage precision manufacturing capabilities, machined components, materials, and tolerances.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-brand-orange/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product / Service</span>
        </button>
      </div>

      {statusMsg.text && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Loading catalog from PostgreSQL...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">No products found. Add one above.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-steel-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-950 mb-3">
                  <img
                    src={item.image_url || '/assets/backgroundcnc.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover filter brightness-90"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/backgroundcnc.jpg';
                    }}
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-950/90 text-brand-orange px-2 py-0.5 rounded border border-brand-orange/30">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.summary}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">Order #{item.sort_order}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-steel-950 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
            <button
              onClick={() => setIsNewModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-4">
              {editingItem ? `Edit Component / Service` : `Add New Component / Service`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. CNC Turn-Milled Spline Shaft"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="CNC Machining / VMC / Traub"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Short Summary (Preview text)</label>
                <input
                  type="text"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Single-line highlight for cards..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Detailed Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Full engineering description..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-orange"
                ></textarea>
              </div>

              {/* Image URL & Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div className="sm:col-span-4 pt-4 sm:pt-0">
                  <label className="cursor-pointer inline-flex items-center justify-center space-x-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Specifications Key-Value List */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-400">Technical Specifications</span>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-xs text-brand-orange hover:underline font-medium"
                  >
                    + Add Spec Row
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {form.specifications.map((s, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. Material)"
                        value={s.label}
                        onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. EN24 Steel)"
                        value={s.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-lg text-xs shadow-lg shadow-brand-orange/20"
                >
                  {editingItem ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

