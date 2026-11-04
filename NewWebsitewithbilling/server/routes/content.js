import express from 'express';
import { query } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: Get all content in one payload for ultra-fast landing page rendering
router.get('/', async (req, res) => {
  try {
    const [companyRes, heroRes, aboutRes, servicesRes, machineryRes] = await Promise.all([
      query('SELECT * FROM company_settings ORDER BY id ASC LIMIT 1'),
      query('SELECT * FROM hero_content ORDER BY id ASC LIMIT 1'),
      query('SELECT * FROM about_content ORDER BY id ASC LIMIT 1'),
      query('SELECT * FROM services_products WHERE is_active = true ORDER BY sort_order ASC, id ASC'),
      query('SELECT * FROM machinery_equipment ORDER BY sort_order ASC, id ASC'),
    ]);

    return res.json({
      success: true,
      company: companyRes.rows[0] || {},
      hero: heroRes.rows[0] || {},
      about: aboutRes.rows[0] || {},
      services: servicesRes.rows || [],
      machinery: machineryRes.rows || [],
    });
  } catch (err) {
    console.error('Content fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch content', error: err.message });
  }
});

// Admin: Update Company Settings (Company Name, Logo, Address, Contact, GST, etc.)
router.put('/company', authenticateAdmin, async (req, res) => {
  const {
    company_name, tagline, logo_url, favicon_url, phone_primary, phone_secondary,
    email_primary, email_sales, address_line1, address_line2, city, state, postal_code,
    country, gstin, pan, working_hours, about_short, footer_text, bank_name,
    bank_account_no, bank_ifsc, bank_branch
  } = req.body;

  try {
    const existing = await query('SELECT id FROM company_settings ORDER BY id ASC LIMIT 1');
    let result;

    if (existing.rows.length > 0) {
      result = await query(`
        UPDATE company_settings SET
          company_name = COALESCE($1, company_name),
          tagline = COALESCE($2, tagline),
          logo_url = COALESCE($3, logo_url),
          favicon_url = COALESCE($4, favicon_url),
          phone_primary = COALESCE($5, phone_primary),
          phone_secondary = COALESCE($6, phone_secondary),
          email_primary = COALESCE($7, email_primary),
          email_sales = COALESCE($8, email_sales),
          address_line1 = COALESCE($9, address_line1),
          address_line2 = COALESCE($10, address_line2),
          city = COALESCE($11, city),
          state = COALESCE($12, state),
          postal_code = COALESCE($13, postal_code),
          country = COALESCE($14, country),
          gstin = COALESCE($15, gstin),
          pan = COALESCE($16, pan),
          working_hours = COALESCE($17, working_hours),
          about_short = COALESCE($18, about_short),
          footer_text = COALESCE($19, footer_text),
          bank_name = COALESCE($20, bank_name),
          bank_account_no = COALESCE($21, bank_account_no),
          bank_ifsc = COALESCE($22, bank_ifsc),
          bank_branch = COALESCE($23, bank_branch),
          updated_at = NOW()
        WHERE id = $24
        RETURNING *
      `, [
        company_name, tagline, logo_url, favicon_url, phone_primary, phone_secondary,
        email_primary, email_sales, address_line1, address_line2, city, state, postal_code,
        country, gstin, pan, working_hours, about_short, footer_text, bank_name,
        bank_account_no, bank_ifsc, bank_branch, existing.rows[0].id
      ]);
    } else {
      result = await query(`
        INSERT INTO company_settings (
          company_name, tagline, logo_url, favicon_url, phone_primary, phone_secondary,
          email_primary, email_sales, address_line1, address_line2, city, state, postal_code,
          country, gstin, pan, working_hours, about_short, footer_text, bank_name,
          bank_account_no, bank_ifsc, bank_branch
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
        ) RETURNING *
      `, [
        company_name, tagline, logo_url, favicon_url, phone_primary, phone_secondary,
        email_primary, email_sales, address_line1, address_line2, city, state, postal_code,
        country, gstin, pan, working_hours, about_short, footer_text, bank_name,
        bank_account_no, bank_ifsc, bank_branch
      ]);
    }

    await query(
      'INSERT INTO audit_logs (action, entity, details, ip_address) VALUES ($1, $2, $3, $4)',
      ['UPDATE_COMPANY', 'company_settings', `Company settings updated by ${req.user.username}`, req.ip]
    );

    return res.json({ success: true, message: 'Company settings updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Update company settings error:', err);
    return res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
});

// Admin: Update Hero Content
router.put('/hero', authenticateAdmin, async (req, res) => {
  const {
    badge_text, headline, subheadline, primary_cta_text, primary_cta_link,
    secondary_cta_text, secondary_cta_link, bg_image_url,
    stat1_value, stat1_label, stat2_value, stat2_label,
    stat3_value, stat3_label, stat4_value, stat4_label
  } = req.body;

  try {
    const existing = await query('SELECT id FROM hero_content ORDER BY id ASC LIMIT 1');
    let result;

    if (existing.rows.length > 0) {
      result = await query(`
        UPDATE hero_content SET
          badge_text = COALESCE($1, badge_text),
          headline = COALESCE($2, headline),
          subheadline = COALESCE($3, subheadline),
          primary_cta_text = COALESCE($4, primary_cta_text),
          primary_cta_link = COALESCE($5, primary_cta_link),
          secondary_cta_text = COALESCE($6, secondary_cta_text),
          secondary_cta_link = COALESCE($7, secondary_cta_link),
          bg_image_url = COALESCE($8, bg_image_url),
          stat1_value = COALESCE($9, stat1_value),
          stat1_label = COALESCE($10, stat1_label),
          stat2_value = COALESCE($11, stat2_value),
          stat2_label = COALESCE($12, stat2_label),
          stat3_value = COALESCE($13, stat3_value),
          stat3_label = COALESCE($14, stat3_label),
          stat4_value = COALESCE($15, stat4_value),
          stat4_label = COALESCE($16, stat4_label),
          updated_at = NOW()
        WHERE id = $17
        RETURNING *
      `, [
        badge_text, headline, subheadline, primary_cta_text, primary_cta_link,
        secondary_cta_text, secondary_cta_link, bg_image_url,
        stat1_value, stat1_label, stat2_value, stat2_label,
        stat3_value, stat3_label, stat4_value, stat4_label, existing.rows[0].id
      ]);
    } else {
      result = await query(`
        INSERT INTO hero_content (
          badge_text, headline, subheadline, primary_cta_text, primary_cta_link,
          secondary_cta_text, secondary_cta_link, bg_image_url,
          stat1_value, stat1_label, stat2_value, stat2_label,
          stat3_value, stat3_label, stat4_value, stat4_label
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        RETURNING *
      `, [
        badge_text, headline, subheadline, primary_cta_text, primary_cta_link,
        secondary_cta_text, secondary_cta_link, bg_image_url,
        stat1_value, stat1_label, stat2_value, stat2_label,
        stat3_value, stat3_label, stat4_value, stat4_label
      ]);
    }

    return res.json({ success: true, message: 'Hero content updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Update About Content
router.put('/about', authenticateAdmin, async (req, res) => {
  const {
    section_title, headline, description_para1, description_para2,
    mission, vision, facility_area, machinist_strength
  } = req.body;

  try {
    const existing = await query('SELECT id FROM about_content ORDER BY id ASC LIMIT 1');
    let result;

    if (existing.rows.length > 0) {
      result = await query(`
        UPDATE about_content SET
          section_title = COALESCE($1, section_title),
          headline = COALESCE($2, headline),
          description_para1 = COALESCE($3, description_para1),
          description_para2 = COALESCE($4, description_para2),
          mission = COALESCE($5, mission),
          vision = COALESCE($6, vision),
          facility_area = COALESCE($7, facility_area),
          machinist_strength = COALESCE($8, machinist_strength),
          updated_at = NOW()
        WHERE id = $9
        RETURNING *
      `, [
        section_title, headline, description_para1, description_para2,
        mission, vision, facility_area, machinist_strength, existing.rows[0].id
      ]);
    } else {
      result = await query(`
        INSERT INTO about_content (
          section_title, headline, description_para1, description_para2,
          mission, vision, facility_area, machinist_strength
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        section_title, headline, description_para1, description_para2,
        mission, vision, facility_area, machinist_strength
      ]);
    }

    return res.json({ success: true, message: 'About content updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- Services & Products CRUD ---
router.get('/services', async (req, res) => {
  try {
    const result = await query('SELECT * FROM services_products ORDER BY sort_order ASC, id ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/services', authenticateAdmin, async (req, res) => {
  const { title, category, summary, description, specifications, image_url, sort_order, is_featured, is_active } = req.body;
  try {
    const result = await query(`
      INSERT INTO services_products (
        title, category, summary, description, specifications, image_url, sort_order, is_featured, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      title,
      category || 'Machining',
      summary || '',
      description || '',
      JSON.stringify(specifications || []),
      image_url || '/assets/backgroundcnc.jpg',
      sort_order || 1,
      is_featured !== undefined ? is_featured : true,
      is_active !== undefined ? is_active : true,
    ]);
    return res.status(201).json({ success: true, message: 'Service/Product added', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/services/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, category, summary, description, specifications, image_url, sort_order, is_featured, is_active } = req.body;
  try {
    const result = await query(`
      UPDATE services_products SET
        title = COALESCE($1, title),
        category = COALESCE($2, category),
        summary = COALESCE($3, summary),
        description = COALESCE($4, description),
        specifications = COALESCE($5, specifications),
        image_url = COALESCE($6, image_url),
        sort_order = COALESCE($7, sort_order),
        is_featured = COALESCE($8, is_featured),
        is_active = COALESCE($9, is_active),
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      title,
      category,
      summary,
      description,
      specifications ? JSON.stringify(specifications) : null,
      image_url,
      sort_order,
      is_featured,
      is_active,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service/Product not found' });
    }
    return res.json({ success: true, message: 'Service/Product updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/services/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM services_products WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Service/Product deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- Machinery CRUD ---
router.get('/machinery', async (req, res) => {
  try {
    const result = await query('SELECT * FROM machinery_equipment ORDER BY sort_order ASC, id ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/machinery', authenticateAdmin, async (req, res) => {
  const { machine_name, category, make_model, capacity, accuracy, quantity, image_url, sort_order } = req.body;
  try {
    const result = await query(`
      INSERT INTO machinery_equipment (
        machine_name, category, make_model, capacity, accuracy, quantity, image_url, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      machine_name,
      category || 'CNC Machining',
      make_model || '',
      capacity || '',
      accuracy || '',
      quantity || 1,
      image_url || '/assets/backgroundcnc.jpg',
      sort_order || 1
    ]);
    return res.status(201).json({ success: true, message: 'Machine added', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/machinery/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { machine_name, category, make_model, capacity, accuracy, quantity, image_url, sort_order } = req.body;
  try {
    const result = await query(`
      UPDATE machinery_equipment SET
        machine_name = COALESCE($1, machine_name),
        category = COALESCE($2, category),
        make_model = COALESCE($3, make_model),
        capacity = COALESCE($4, capacity),
        accuracy = COALESCE($5, accuracy),
        quantity = COALESCE($6, quantity),
        image_url = COALESCE($7, image_url),
        sort_order = COALESCE($8, sort_order)
      WHERE id = $9
      RETURNING *
    `, [
      machine_name, category, make_model, capacity, accuracy, quantity, image_url, sort_order, id
    ]);
    return res.json({ success: true, message: 'Machine updated', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/machinery/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM machinery_equipment WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Machine deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

