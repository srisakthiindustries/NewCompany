import express from 'express';
import { query } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Indian Currency Words Converter
function numberToIndianWords(number) {
  const num = Math.round(Number(number) || 0);
  if (num === 0) return 'Rupees Zero Only';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n) {
    if (n < 10) return units[n];
    if (n >= 10 && n < 20) return teens[n - 10];
    const unitPart = units[n % 10];
    return tens[Math.floor(n / 10)] + (unitPart ? ' ' + unitPart : '');
  }

  function convertThreeDigits(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (hundred > 0) {
      res += units[hundred] + ' Hundred';
      if (rest > 0) res += ' and ';
    }
    if (rest > 0) {
      res += convertTwoDigits(rest);
    }
    return res;
  }

  let crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  let thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;
  let hundreds = remainder;

  let words = 'Rupees ';
  if (crore > 0) words += convertTwoDigits(crore) + ' Crore ';
  if (lakh > 0) words += convertTwoDigits(lakh) + ' Lakh ';
  if (thousand > 0) words += convertTwoDigits(thousand) + ' Thousand ';
  if (hundreds > 0) words += convertThreeDigits(hundreds) + ' ';

  return words.trim() + ' Only';
}

// Get Next Auto Invoice Number
router.get('/next-number', authenticateAdmin, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const nextYearShort = (currentYear + 1).toString().slice(-2);
    const financialYear = `${currentYear}-${nextYearShort}`;

    const countRes = await query('SELECT COUNT(*) FROM billing_invoices');
    const nextCount = parseInt(countRes.rows[0].count, 10) + 1;
    const formattedSeq = String(nextCount).padStart(4, '0');

    const nextInvoiceNumber = `SSI/INV/${financialYear}/${formattedSeq}`;
    return res.json({ success: true, nextInvoiceNumber });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- Customers CRUD ---
router.get('/customers', authenticateAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM billing_customers ORDER BY customer_name ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/customers', authenticateAdmin, async (req, res) => {
  const { customer_name, company_name, gstin, email, phone, billing_address, shipping_address, state, state_code } = req.body;
  if (!customer_name) {
    return res.status(400).json({ success: false, message: 'Customer name is required' });
  }
  try {
    const result = await query(`
      INSERT INTO billing_customers (
        customer_name, company_name, gstin, email, phone, billing_address, shipping_address, state, state_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      customer_name, company_name || customer_name, gstin || '', email || '', phone || '',
      billing_address || '', shipping_address || billing_address || '',
      state || 'Tamil Nadu', state_code || '33'
    ]);
    return res.status(201).json({ success: true, message: 'Customer added', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- Invoices CRUD ---
router.get('/invoices', authenticateAdmin, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        i.*,
        c.phone as customer_phone,
        c.email as customer_email
      FROM billing_invoices i
      LEFT JOIN billing_customers c ON i.customer_id = c.id
      ORDER BY i.invoice_date DESC, i.id DESC
    `);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/invoices/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const invRes = await query('SELECT * FROM billing_invoices WHERE id = $1', [id]);
    if (invRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    const compRes = await query('SELECT * FROM company_settings LIMIT 1');
    return res.json({
      success: true,
      invoice: invRes.rows[0],
      company: compRes.rows[0] || {}
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Create Invoice with Line Items & Automated Calculations
router.post('/invoices', authenticateAdmin, async (req, res) => {
  const {
    invoice_number, invoice_date, due_date, challan_number, customer_id,
    customer_name, customer_gstin, billing_address, place_of_supply,
    items, is_interstate, notes
  } = req.body;

  if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Customer name and at least one line item are required' });
  }

  try {
    // Process Items & Calculate Taxes
    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    const processedItems = items.map(item => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const taxable = Math.round(qty * rate * 100) / 100;
      const gstRate = Number(item.gst_rate) || 18.00;

      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (is_interstate) {
        igst = Math.round((taxable * gstRate / 100) * 100) / 100;
      } else {
        cgst = Math.round((taxable * (gstRate / 2) / 100) * 100) / 100;
        sgst = Math.round((taxable * (gstRate / 2) / 100) * 100) / 100;
      }

      const lineTotal = Math.round((taxable + cgst + sgst + igst) * 100) / 100;

      subtotal += taxable;
      totalCgst += cgst;
      totalSgst += sgst;
      totalIgst += igst;

      return {
        item_desc: item.item_desc,
        hsn_sac: item.hsn_sac || '8483',
        quantity: qty,
        uom: item.uom || 'NOS',
        rate: rate,
        taxable_amount: taxable,
        gst_rate: gstRate,
        cgst_amount: cgst,
        sgst_amount: sgst,
        igst_amount: igst,
        total: lineTotal
      };
    });

    const calculatedTotal = subtotal + totalCgst + totalSgst + totalIgst;
    const roundedGrandTotal = Math.round(calculatedTotal);
    const roundOff = Math.round((roundedGrandTotal - calculatedTotal) * 100) / 100;
    const amountInWords = numberToIndianWords(roundedGrandTotal);

    const invNum = invoice_number || `SSI/INV/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`;

    const result = await query(`
      INSERT INTO billing_invoices (
        invoice_number, invoice_date, due_date, challan_number, customer_id,
        customer_name, customer_gstin, billing_address, place_of_supply,
        items, subtotal, cgst_rate, total_cgst, sgst_rate, total_sgst,
        igst_rate, total_igst, round_off, grand_total, amount_in_words,
        payment_status, notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 'Unpaid', $21
      ) RETURNING *
    `, [
      invNum,
      invoice_date || new Date().toISOString().split('T')[0],
      due_date || null,
      challan_number || '',
      customer_id || null,
      customer_name,
      customer_gstin || '',
      billing_address || '',
      place_of_supply || (is_interstate ? 'Other State' : 'Tamil Nadu (33)'),
      JSON.stringify(processedItems),
      subtotal,
      is_interstate ? 0.00 : 9.00,
      totalCgst,
      is_interstate ? 0.00 : 9.00,
      totalSgst,
      is_interstate ? 18.00 : 0.00,
      totalIgst,
      roundOff,
      roundedGrandTotal,
      amountInWords,
      notes || 'Goods once dispatched are strictly subject to warranty terms. Inspection clearance certificate attached.'
    ]);

    await query(
      'INSERT INTO audit_logs (action, entity, details, ip_address) VALUES ($1, $2, $3, $4)',
      ['CREATE_INVOICE', 'billing_invoices', `Created Tax Invoice ${invNum} for ${customer_name} (Total: ₹${roundedGrandTotal})`, req.ip]
    );

    return res.status(201).json({ success: true, message: 'Invoice generated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Invoice creation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate invoice', error: err.message });
  }
});

// Update Invoice Payment Status
router.patch('/invoices/:id/status', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { payment_status, payment_mode } = req.body;
  try {
    const result = await query(`
      UPDATE billing_invoices SET
        payment_status = COALESCE($1, payment_status),
        payment_mode = COALESCE($2, payment_mode)
      WHERE id = $3
      RETURNING *
    `, [payment_status, payment_mode, id]);

    return res.json({ success: true, message: 'Payment status updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Invoice
router.delete('/invoices/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM billing_invoices WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

