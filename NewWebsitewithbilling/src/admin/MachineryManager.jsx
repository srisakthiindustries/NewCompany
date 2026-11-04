import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';
import { api } from '../services/api';

export default function MachineryManager({ onRefreshContent }) {
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const defaultForm = {
    machine_name: '',
    category: 'CNC Turning',
    make_model: '',
    capacity: '',
    accuracy: '±0.005 mm',
    quantity: 1,
    image_url: '/assets/backgroundcnc.jpg',
    sort_order: 1
  };

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    loadMachinery();
  }, []);

  const loadMachinery = async () => {
    setLoading(true);
    try {
      const res = await api.getMachinery();
      setMachinery(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setForm(defaultForm);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setForm({ ...item });
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateMachine(editingItem.id, form);
      } else {
        await api.createMachine(form);
      }
      setIsModalOpen(false);
      loadMachinery();
      if (onRefreshContent) onRefreshContent();
    } catch (err) {
      alert(err.message || 'Failed to save machine');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete machine "${name}"?`)) return;
    try {
      await api.deleteMachine(id);
      loadMachinery();
      if (onRefreshContent) onRefreshContent();
    } catch (err) {
      alert(err.message || 'Failed to delete machine');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Machine Shop Infrastructure Manager</h2>
          <p className="text-xs text-slate-400 font-mono">
            Manage plant CNC turning centers, vertical machining centers, Traub lathes, and Mitutoyo CMM metrology.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-sky-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Machine Tool</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Loading machine list from PostgreSQL...</div>
      ) : machinery.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">No machinery found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machinery.map((m) => (
            <div
              key={m.id}
              className="bg-steel-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-sky-400 border border-slate-800">
                    {m.category}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-orange/15 text-brand-orange">
                    {m.quantity} Unit(s)
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mb-1">{m.machine_name}</h3>
                <div className="text-xs text-slate-400 font-mono mb-3">{m.make_model}</div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div><span className="text-slate-500">Capacity: </span>{m.capacity}</div>
                  <div><span className="text-slate-500">Accuracy: </span><span className="text-emerald-400 font-mono">{m.accuracy}</span></div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(m)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(m.id, m.machine_name)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-steel-950 border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-4">
              {editingItem ? 'Edit Machine Tool' : 'Add Machine Tool'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Machine Name *</label>
                <input
                  type="text"
                  required
                  value={form.machine_name}
                  onChange={(e) => setForm({ ...form, machine_name: e.target.value })}
                  placeholder="e.g. Doosan Lynx 2100LSY CNC Turning"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="CNC Turning / VMC / CMM"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Make & Manufacturer</label>
                <input
                  type="text"
                  value={form.make_model}
                  onChange={(e) => setForm({ ...form, make_model: e.target.value })}
                  placeholder="e.g. Mazak, Japan / DN Solutions"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Working Capacity & Travels</label>
                <input
                  type="text"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="e.g. X: 1050mm, Y: 530mm, Z: 510mm | 12,000 RPM"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Accuracy / Repeatability Gate</label>
                <input
                  type="text"
                  value={form.accuracy}
                  onChange={(e) => setForm({ ...form, accuracy: e.target.value })}
                  placeholder="e.g. ±0.003 mm Positional | ±0.002 mm Repeatability"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs"
                >
                  {editingItem ? 'Update Machine' : 'Create Machine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

