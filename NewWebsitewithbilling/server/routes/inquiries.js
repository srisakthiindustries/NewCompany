import express from 'express';
import { query } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: Submit a Quote Request / RFQ
router.post('/', async (req, res) => {
  const {
    customer_name, company_name, email, phone, service_type,
    material_preference, estimated_quantity, target_date, specifications_notes
  } = req.body;

  if (!customer_name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email, and phone number are required' });
  }

  try {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const rfq_number = `RFQ-${new Date().getFullYear()}-${randomSuffix}`;

    const result = await query(`
      INSERT INTO quote_inquiries (
        rfq_number, customer_name, company_name, email, phone, service_type,
        material_preference, estimated_quantity, target_date, specifications_notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'New')
      RETURNING *
    `, [
      rfq_number, customer_name, company_name || 'Individual / Not specified',
      email, phone, service_type || 'General Machining',
      material_preference || 'Standard Alloy / Customer Specified',
      estimated_quantity || 'Batch / Production',
      target_date || 'Standard Lead Time',
      specifications_notes || ''
    ]);

    await query(
      'INSERT INTO audit_logs (action, entity, details, ip_address) VALUES ($1, $2, $3, $4)',
      ['NEW_INQUIRY', 'quote_inquiries', `New RFQ ${rfq_number} received from ${customer_name} (${email})`, req.ip]
    );

    return res.status(201).json({
      success: true,
      message: 'Your quote request has been received! Our engineering team will review your specifications and contact you promptly.',
      rfq_number,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Inquiry submission error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit quote request', error: err.message });
  }
});

// Admin: Get all inquiries
router.get('/', authenticateAdmin, async (req, res) => {
  const { status, search } = req.query;
  try {
    let sql = 'SELECT * FROM quote_inquiries WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (customer_name ILIKE $${params.length} OR company_name ILIKE $${params.length} OR rfq_number ILIKE $${params.length} OR email ILIKE $${params.length})`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Update inquiry status and notes
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  try {
    const result = await query(`
      UPDATE quote_inquiries SET
        status = COALESCE($1, status),
        admin_notes = COALESCE($2, admin_notes),
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [status, admin_notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    return res.json({ success: true, message: 'Inquiry updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Delete inquiry
router.delete('/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM quote_inquiries WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

