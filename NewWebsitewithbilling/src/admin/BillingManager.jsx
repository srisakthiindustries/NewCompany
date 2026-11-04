import React, { useState, useEffect, useRef } from 'react';
import { Plus, Printer, Trash2, CheckCircle2, FileText, ArrowLeft, Building2, User, Check, X } from 'lucide-react';
import { api } from '../services/api';

export default function BillingManager({ company }) {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('list'); // 'list' | 'create' | 'view_invoice'
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // New Invoice Form State
  const [customersList, setCustomersList] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [challanNumber, setChallanNumber] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [isInterstate, setIsInterstate] = useState(false);
  const [notes, setNotes] = useState('Goods once sold will not be taken back. Interest @18% p.a. will be charged for delayed payments.');

  const [items, setItems] = useState([
    {
      item_desc: 'CNC Turn-Milled Spline Shaft (EN24 Hardened)',
      hsn_sac: '8483',
      quantity: 100,
      uom: 'NOS',
      rate: 450,
      gst_rate: 18
    }
  ]);

  useEffect(() => {
    loadInvoices();
    loadCustomers();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.getInvoices();
      setInvoices(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await api.getBillingCustomers();
      setCustomers(res.data || []);
      setCustomersList(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateInvoice = async () => {
    try {
      const numRes = await api.getNextInvoiceNumber();
      setInvoiceNumber(numRes.nextInvoiceNumber || `SSI/INV/${new Date().getFullYear()}/0001`);
    } catch (err) {
      setInvoiceNumber(`SSI/INV/${new Date().getFullYear()}/0001`);
    }
    setActiveView('create');
  };

  const handleCustomerSelect = (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    const found = customers.find(c => c.id === parseInt(custId, 10));
    if (found) {
      setCustomerName(found.company_name || found.customer_name);
      setCustomerGstin(found.gstin || '');
      setBillingAddress(found.billing_address || '');
      setIsInterstate(found.state_code && found.state_code !== '33');
    }
  };

  const handleAddItem = () => {
    setItems([...items, {
      item_desc: '',
      hsn_sac: '8483',
      quantity: 1,
      uom: 'NOS',
      rate: 0,
      gst_rate: 18
    }]);
  };

  const handleItemChange = (idx, field, val) => {
    const updated = [...items];
    updated[idx][field] = val;
    setItems(updated);
  };

  const handleRemoveItem = (idx) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  // Calculations
  const calculateTotals = () => {
    let subtotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    items.forEach(item => {
      const lineTaxable = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
      const rate = Number(item.gst_rate) || 18;
      subtotal += lineTaxable;

      if (isInterstate) {
        igst += lineTaxable * rate / 100;
      } else {
        cgst += lineTaxable * (rate / 2) / 100;
        sgst += lineTaxable * (rate / 2) / 100;
      }
    });

    const calculatedTotal = subtotal + cgst + sgst + igst;
    const grandTotal = Math.round(calculatedTotal);
    const roundOff = Math.round((grandTotal - calculatedTotal) * 100) / 100;

    return { subtotal, cgst, sgst, igst, grandTotal, roundOff };
  };

  const totals = calculateTotals();

  const handleSaveInvoice = async (e) => {
    e.preventDefault();
    if (!customerName) {
      alert('Please enter or select a customer name');
      return;
    }

    try {
      const payload = {
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        due_date: dueDate || null,
        challan_number: challanNumber,
        customer_id: selectedCustomerId ? parseInt(selectedCustomerId, 10) : null,
        customer_name: customerName,
        customer_gstin: customerGstin,
        billing_address: billingAddress,
        place_of_supply: isInterstate ? 'Inter-State' : 'Tamil Nadu (33)',
        items: items,
        is_interstate: isInterstate,
        notes: notes
      };

      const res = await api.createInvoice(payload);
      alert('Tax Invoice successfully created in PostgreSQL!');
      setActiveView('list');
      loadInvoices();
    } catch (err) {
      alert(err.message || 'Failed to create invoice');
    }
  };

  const handleViewInvoice = (inv) => {
    setSelectedInvoice(inv);
    setActiveView('view_invoice');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateInvoiceStatus(id, status);
      loadInvoices();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleDelete = async (id, num) => {
    if (!window.confirm(`Delete Invoice ${num}?`)) return;
    try {
      await api.deleteInvoice(id);
      loadInvoices();
    } catch (err) {
      alert(err.message || 'Failed to delete invoice');
    }
  };

  return (
    <div className="space-y-6">
      {/* View: List Invoices */}
      {activeView === 'list' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
            <div>
              <h2 className="text-2xl font-black text-white">GST Billing & Tax Invoicing System</h2>
              <p className="text-xs text-slate-400 font-mono">
                Generate official tax invoices, calculate CGST/SGST/IGST, track DC delivery challans, and print.
              </p>
            </div>

            <button
              onClick={openCreateInvoice}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-brand-orange/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Tax Invoice</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading billing ledger from PostgreSQL...</div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">No invoices found. Click Create New Tax Invoice above.</div>
          ) : (
            <div className="bg-steel-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Invoice No</th>
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5">Customer</th>
                      <th className="px-5 py-3.5">Challan Ref</th>
                      <th className="px-5 py-3.5 text-right">Taxable Amt</th>
                      <th className="px-5 py-3.5 text-right">Grand Total (₹)</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-brand-orange">
                          {inv.invoice_number}
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-400">
                          {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-5 py-4 font-semibold text-white">
                          <div>{inv.customer_name}</div>
                          {inv.customer_gstin && (
                            <div className="text-[10px] text-slate-400 font-mono">GSTIN: {inv.customer_gstin}</div>
                          )}
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-400">
                          {inv.challan_number || '-'}
                        </td>
                        <td className="px-5 py-4 text-right font-mono">
                          ₹{Number(inv.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-4 text-right font-mono font-bold text-emerald-400 text-sm">
                          ₹{Number(inv.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <select
                            value={inv.payment_status || 'Unpaid'}
                            onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                            className={`px-2 py-1 rounded text-[11px] font-mono font-bold border ${
                              inv.payment_status === 'Paid'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                            <option value="Partially Paid">Partially Paid</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-5 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleViewInvoice(inv)}
                            className="p-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 transition-colors inline-flex items-center space-x-1"
                            title="Print / View"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Print</span>
                          </button>
                          <button
                            onClick={() => handleDelete(inv.id, inv.invoice_number)}
                            className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View: Create Invoice */}
      {activeView === 'create' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <button
              onClick={() => setActiveView('list')}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invoice Ledger</span>
            </button>
            <h2 className="text-xl font-black text-white">Generate GST Tax Invoice</h2>
          </div>

          <form onSubmit={handleSaveInvoice} className="space-y-6">
            {/* Header Form */}
            <div className="bg-steel-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-brand-orange font-mono font-bold focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Invoice Date *</label>
                  <input
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Delivery Challan (DC) Ref</label>
                  <input
                    type="text"
                    value={challanNumber}
                    onChange={(e) => setChallanNumber(e.target.value)}
                    placeholder="DC/2026/0192"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              {/* Customer Selector */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Select Customer Account</label>
                  <select
                    value={selectedCustomerId}
                    onChange={handleCustomerSelect}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value="">-- Choose Existing Customer --</option>
                    {customersList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name || c.customer_name} ({c.gstin || 'No GST'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Customer / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ashok Leyland Ltd"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Customer GSTIN</label>
                  <input
                    type="text"
                    value={customerGstin}
                    onChange={(e) => setCustomerGstin(e.target.value)}
                    placeholder="33AAAAA0000A1Z5"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Customer Billing Address</label>
                <textarea
                  rows={2}
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="Factory / Registered address..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-orange text-xs"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="interstate"
                  checked={isInterstate}
                  onChange={(e) => setIsInterstate(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-brand-orange focus:ring-brand-orange"
                />
                <label htmlFor="interstate" className="text-slate-300 font-medium cursor-pointer">
                  Inter-State Supply (Apply Integrated IGST instead of CGST + SGST)
                </label>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="bg-steel-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm">Line Items & Components</h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs text-brand-orange hover:underline font-bold"
                >
                  + Add Line Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => {
                  const lineTaxable = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                  const gst = lineTaxable * (Number(item.gst_rate) || 18) / 100;
                  const lineTotal = lineTaxable + gst;

                  return (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-12 gap-3 items-center text-xs">
                      <div className="col-span-12 sm:col-span-4">
                        <label className="block text-[10px] text-slate-500 mb-0.5">Item Description *</label>
                        <input
                          type="text"
                          required
                          value={item.item_desc}
                          onChange={(e) => handleItemChange(idx, 'item_desc', e.target.value)}
                          placeholder="e.g. CNC Turned Brass Bush"
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">HSN / SAC</label>
                        <input
                          type="text"
                          value={item.hsn_sac}
                          onChange={(e) => handleItemChange(idx, 'hsn_sac', e.target.value)}
                          placeholder="8483"
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">Qty / Unit</label>
                        <div className="flex space-x-1">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-2/3 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white font-mono"
                          />
                          <input
                            type="text"
                            value={item.uom}
                            onChange={(e) => handleItemChange(idx, 'uom', e.target.value)}
                            className="w-1/3 bg-slate-900 border border-slate-700 rounded px-1 py-1.5 text-slate-400 text-center font-mono"
                          />
                        </div>
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">Unit Rate (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono text-right"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-500">Total (Inc. GST)</div>
                          <div className="font-mono font-bold text-white text-xs">₹{lineTotal.toFixed(2)}</div>
                        </div>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Calculation Summary Footer */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="w-full sm:w-1/2">
                  <label className="block text-slate-400 text-xs mb-1">Invoice Notes / Terms</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300"
                  ></textarea>
                </div>

                <div className="w-full sm:w-80 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxable Subtotal:</span>
                    <span className="text-white">₹{totals.subtotal.toFixed(2)}</span>
                  </div>

                  {isInterstate ? (
                    <div className="flex justify-between text-sky-400">
                      <span>IGST (18%):</span>
                      <span>₹{totals.igst.toFixed(2)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sky-400">
                        <span>CGST (9%):</span>
                        <span>₹{totals.cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sky-400">
                        <span>SGST (9%):</span>
                        <span>₹{totals.sgst.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Round Off:</span>
                    <span>₹{totals.roundOff.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-emerald-400">
                    <span>Grand Total:</span>
                    <span>₹{totals.grandTotal.toLocaleString('en-IN')}.00</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveView('list')}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-brand-orange/20"
                >
                  Save & Issue Invoice
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* View: Print / View Tax Invoice */}
      {activeView === 'view_invoice' && selectedInvoice && (
        <div className="space-y-6">
          <div className="no-print flex items-center justify-between pb-4 border-b border-slate-800">
            <button
              onClick={() => setActiveView('list')}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invoice Ledger</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-xl text-xs sm:text-sm shadow-xl shadow-brand-orange/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice (Ctrl + P)</span>
            </button>
          </div>

          {/* Printable Formal Invoice Paper (White Background with Sri Sakthi letterhead) */}
          <div className="invoice-paper bg-white text-black p-8 sm:p-12 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-slate-300 font-sans text-xs">
            {/* Top Header */}
            <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <img
                  src={company.logo_url || '/assets/logo300 x 100.png'}
                  alt={company.company_name}
                  className="h-14 w-auto object-contain filter contrast-125"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/logo300 x 100.png';
                  }}
                />
                <div>
                  <h1 className="text-xl font-black text-black tracking-tight uppercase">
                    {company.company_name || 'Sri Sakthi Industries'}
                  </h1>
                  <p className="text-[11px] text-gray-700 font-medium">
                    {company.tagline || 'Precision Mechanical Engineering & Manufacturing Solutions'}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">
                    {company.address_line1}, {company.address_line2}, {company.city} - {company.postal_code}, {company.state}
                  </p>
                  <p className="text-[10px] text-gray-700 font-bold font-mono">
                    GSTIN: {company.gstin} | PAN: {company.pan} | Phone: {company.phone_primary}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-black text-white font-mono font-bold text-xs uppercase tracking-wider mb-2">
                  TAX INVOICE
                </span>
                <div className="text-[11px] font-mono">
                  <div><strong>Invoice No:</strong> {selectedInvoice.invoice_number}</div>
                  <div><strong>Date:</strong> {new Date(selectedInvoice.invoice_date).toLocaleDateString()}</div>
                  {selectedInvoice.challan_number && (
                    <div><strong>DC Ref:</strong> {selectedInvoice.challan_number}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Bill To & Supply Info */}
            <div className="grid grid-cols-2 gap-6 p-3 bg-gray-50 border border-gray-300 rounded mb-4 text-[11px]">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase font-mono block mb-1">
                  Details of Receiver (Billed To):
                </span>
                <div className="font-bold text-sm text-black">{selectedInvoice.customer_name}</div>
                <div className="text-gray-700 whitespace-pre-line mt-0.5">{selectedInvoice.billing_address || 'Chennai, Tamil Nadu'}</div>
                <div className="font-mono mt-1">
                  <strong>Customer GSTIN:</strong> {selectedInvoice.customer_gstin || 'Unregistered'}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-500 uppercase font-mono block mb-1">
                  Supply Logistics Details:
                </span>
                <div><strong>Place of Supply:</strong> {selectedInvoice.place_of_supply || 'Tamil Nadu (33)'}</div>
                <div><strong>Reverse Charge:</strong> No</div>
                <div><strong>Payment Status:</strong> <span className="font-bold">{selectedInvoice.payment_status}</span></div>
                <div><strong>Due Date:</strong> {selectedInvoice.due_date ? new Date(selectedInvoice.due_date).toLocaleDateString() : 'Net 30 Days'}</div>
              </div>
            </div>

            {/* Itemized Table */}
            <table className="w-full border-collapse border border-gray-400 text-[11px] mb-4">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-400 font-mono text-[10px] uppercase">
                  <th className="border border-gray-400 p-2 text-center w-8">#</th>
                  <th className="border border-gray-400 p-2 text-left">Description of Goods / Services</th>
                  <th className="border border-gray-400 p-2 text-center w-16">HSN/SAC</th>
                  <th className="border border-gray-400 p-2 text-center w-14">Qty</th>
                  <th className="border border-gray-400 p-2 text-center w-12">UOM</th>
                  <th className="border border-gray-400 p-2 text-right w-20">Rate (₹)</th>
                  <th className="border border-gray-400 p-2 text-right w-24">Taxable Amt</th>
                  <th className="border border-gray-400 p-2 text-right w-24">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let itemsList = [];
                  try {
                    itemsList = typeof selectedInvoice.items === 'string'
                      ? JSON.parse(selectedInvoice.items)
                      : (selectedInvoice.items || []);
                  } catch (e) {
                    itemsList = [];
                  }
                  return itemsList.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-300">
                      <td className="border border-gray-400 p-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-gray-400 p-2 font-medium">{item.item_desc}</td>
                      <td className="border border-gray-400 p-2 text-center font-mono">{item.hsn_sac}</td>
                      <td className="border border-gray-400 p-2 text-center font-mono font-bold">{item.quantity}</td>
                      <td className="border border-gray-400 p-2 text-center font-mono">{item.uom}</td>
                      <td className="border border-gray-400 p-2 text-right font-mono">{Number(item.rate).toFixed(2)}</td>
                      <td className="border border-gray-400 p-2 text-right font-mono">{Number(item.taxable_amount || (item.quantity * item.rate)).toFixed(2)}</td>
                      <td className="border border-gray-400 p-2 text-right font-mono font-bold">{Number(item.total).toFixed(2)}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>

            {/* Tax Computation & Words */}
            <div className="grid grid-cols-12 gap-4 border-t-2 border-black pt-2 mb-6">
              <div className="col-span-7 space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block font-mono">
                    Total Amount in Words:
                  </span>
                  <div className="font-bold text-black italic">
                    {selectedInvoice.amount_in_words}
                  </div>
                </div>

                <div className="p-2 bg-gray-50 border border-gray-300 rounded text-[10px]">
                  <strong>Bank Payment Details:</strong><br />
                  Bank: {company.bank_name || 'State Bank of India'} | A/c No: {company.bank_account_no || '309876543210'}<br />
                  IFSC: {company.bank_ifsc || 'SBIN0001234'} | Branch: {company.bank_branch || 'Industrial Estate, Chennai'}
                </div>

                <div className="text-[10px] text-gray-500 italic">
                  Terms: {selectedInvoice.notes}
                </div>
              </div>

              <div className="col-span-5">
                <table className="w-full text-[11px] font-mono border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-1 text-gray-600">Subtotal:</td>
                      <td className="py-1 text-right font-bold">₹{Number(selectedInvoice.subtotal).toFixed(2)}</td>
                    </tr>
                    {Number(selectedInvoice.total_cgst) > 0 && (
                      <tr>
                        <td className="py-1 text-gray-600">CGST (9%):</td>
                        <td className="py-1 text-right">₹{Number(selectedInvoice.total_cgst).toFixed(2)}</td>
                      </tr>
                    )}
                    {Number(selectedInvoice.total_sgst) > 0 && (
                      <tr>
                        <td className="py-1 text-gray-600">SGST (9%):</td>
                        <td className="py-1 text-right">₹{Number(selectedInvoice.total_sgst).toFixed(2)}</td>
                      </tr>
                    )}
                    {Number(selectedInvoice.total_igst) > 0 && (
                      <tr>
                        <td className="py-1 text-gray-600">IGST (18%):</td>
                        <td className="py-1 text-right">₹{Number(selectedInvoice.total_igst).toFixed(2)}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-1 text-gray-600">Round Off:</td>
                      <td className="py-1 text-right font-mono">₹{Number(selectedInvoice.round_off || 0).toFixed(2)}</td>
                    </tr>
                    <tr className="border-t-2 border-black text-sm">
                      <td className="py-2 font-bold uppercase">Grand Total:</td>
                      <td className="py-2 text-right font-black text-black">₹{Number(selectedInvoice.grand_total).toLocaleString('en-IN')}.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-8 border-t border-gray-300 flex justify-between items-end text-[10px]">
              <div>
                <p>Subject to Chennai Jurisdiction.</p>
                <p>This is a computer-generated tax invoice.</p>
              </div>

              <div className="text-right">
                <p className="font-bold uppercase text-black mb-10">For {company.company_name || 'Sri Sakthi Industries'}</p>
                <div className="border-t border-black pt-1 w-48 inline-block font-mono">
                  Authorized Signatory
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

