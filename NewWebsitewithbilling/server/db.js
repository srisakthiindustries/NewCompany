import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

const isRemoteHost = (process.env.PGHOST && !['127.0.0.1', 'localhost'].includes(process.env.PGHOST)) || process.env.DATABASE_URL;
const useSSL = process.env.PGSSL === 'true' || (isRemoteHost && process.env.PGSSL !== 'false');

const pgConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'Beon@994182',
      host: process.env.PGHOST || '127.0.0.1',
      port: parseInt(process.env.PGPORT || '5433', 10),
      database: process.env.PGDATABASE || 'srisakthi_db',
      ssl: useSSL ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

export const pool = new Pool(pgConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SQL Executed] ${duration}ms:`, text.replace(/\s+/g, ' ').slice(0, 100));
    }
    return res;
  } catch (err) {
    console.error(`[SQL Error]:`, err.message, 'Query was:', text.slice(0, 150));
    throw err;
  }
}

// Schema Initializer & Auto-migrator
export async function initializeDatabase() {
  console.log('[DB] Checking connection & verifying schema in srisakthi_db...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Company Settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS company_settings (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL DEFAULT 'Sri Sakthi Industries',
        tagline TEXT DEFAULT 'Precision Mechanical Engineering, CNC Machining & High-Reliability Manufacturing',
        logo_url TEXT DEFAULT '/assets/logo300 x 100.png',
        favicon_url TEXT DEFAULT '/assets/sale.svg',
        phone_primary VARCHAR(50) DEFAULT '+91 99418 20000',
        phone_secondary VARCHAR(50) DEFAULT '+91 94440 12345',
        email_primary VARCHAR(150) DEFAULT 'info@srisakthiindustries.com',
        email_sales VARCHAR(150) DEFAULT 'sales@srisakthiindustries.com',
        address_line1 TEXT DEFAULT 'Plot No. 42 & 43, SIDCO Industrial Estate',
        address_line2 TEXT DEFAULT 'Ambattur / Sriperumbudur Industrial Corridor',
        city VARCHAR(100) DEFAULT 'Chennai',
        state VARCHAR(100) DEFAULT 'Tamil Nadu',
        postal_code VARCHAR(20) DEFAULT '600058',
        country VARCHAR(50) DEFAULT 'India',
        gstin VARCHAR(50) DEFAULT '33AAECS1234F1Z5',
        pan VARCHAR(50) DEFAULT 'AAECS1234F',
        working_hours VARCHAR(255) DEFAULT 'Mon - Sat: 8:30 AM - 6:30 PM (Machining Units 24/7)',
        about_short TEXT DEFAULT 'Established in 1999, Sri Sakthi Industries is a premier precision mechanical manufacturing job-work partner specializing in high-speed CNC turning, multi-axis VMC milling, stamping, and IATF-compliant components for automotive, defense, and industrial powerhouses.',
        footer_text TEXT DEFAULT '© 2026 Sri Sakthi Industries. All Rights Reserved. Committed to Sub-Micron Precision & Zero Defect Quality.',
        bank_name VARCHAR(150) DEFAULT 'State Bank of India',
        bank_account_no VARCHAR(100) DEFAULT '30987654321',
        bank_ifsc VARCHAR(50) DEFAULT 'SBIN0001234',
        bank_branch VARCHAR(100) DEFAULT 'Industrial Estate Branch',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Hero Content
    await client.query(`
      CREATE TABLE IF NOT EXISTS hero_content (
        id SERIAL PRIMARY KEY,
        badge_text VARCHAR(255) DEFAULT 'IATF 16949 & ISO 9001:2015 Precision Machine Shop',
        headline TEXT DEFAULT 'Ultra-Tight Tolerance CNC Machining & Mechanical Manufacturing',
        subheadline TEXT DEFAULT 'Delivering micron-level accuracy (±0.005mm) for automotive OEMs, defense contractors, and industrial machinery with guaranteed zero-defect traceability.',
        primary_cta_text VARCHAR(100) DEFAULT 'Get Instant Quote',
        primary_cta_link VARCHAR(255) DEFAULT '#quote',
        secondary_cta_text VARCHAR(100) DEFAULT 'View Machine Shop',
        secondary_cta_link VARCHAR(255) DEFAULT '#machinery',
        bg_image_url TEXT DEFAULT '/assets/backgroundcnc.jpg',
        stat1_value VARCHAR(50) DEFAULT '25+',
        stat1_label VARCHAR(100) DEFAULT 'Years Manufacturing Excellence',
        stat2_value VARCHAR(50) DEFAULT '±0.005 mm',
        stat2_label VARCHAR(100) DEFAULT 'Sub-Micron Precision Gate',
        stat3_value VARCHAR(50) DEFAULT '99.8%',
        stat3_label VARCHAR(100) DEFAULT 'On-Time Dispatch Rate',
        stat4_value VARCHAR(50) DEFAULT '500K+',
        stat4_label VARCHAR(100) DEFAULT 'Components Delivered Monthly',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. About Content
    await client.query(`
      CREATE TABLE IF NOT EXISTS about_content (
        id SERIAL PRIMARY KEY,
        section_title VARCHAR(150) DEFAULT 'About Sri Sakthi Industries',
        headline TEXT DEFAULT 'Engineered For Extreme Performance & Total Traceability',
        description_para1 TEXT DEFAULT 'Founded with a dedication to mechanical mastery, Sri Sakthi Industries operates modern precision machining, stamping, and fabrication facilities. We bridge complex blueprint specifications into production-scale reality with uncompromising repeatability.',
        description_para2 TEXT DEFAULT 'Equipped with Japanese and Korean multi-axis CNC Turning Centers, high-speed VMC milling stations, automatic Traub lathes, and Mitutoyo 3D Coordinate Measuring Machines (CMM), we satisfy demanding IATF 16949 and PPAP Level 3 audit criteria.',
        mission TEXT DEFAULT 'To empower global manufacturing with uncompromised precision, rapid turnaround, and zero-defect components through lean manufacturing and automated quality gates.',
        vision TEXT DEFAULT 'To be the most trusted precision mechanical engineering solutions partner recognized worldwide for technical innovation, sustainable practices, and quality leadership.',
        facility_area VARCHAR(100) DEFAULT '35,000 Sq. Ft. Integrated Facility',
        machinist_strength VARCHAR(100) DEFAULT '120+ Skilled Engineers & Technicians',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Services & Products Catalog
    await client.query(`
      CREATE TABLE IF NOT EXISTS services_products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        summary TEXT,
        description TEXT,
        specifications JSONB DEFAULT '[]'::jsonb,
        image_url TEXT,
        is_featured BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Machinery & Infrastructure Showcase
    await client.query(`
      CREATE TABLE IF NOT EXISTS machinery_equipment (
        id SERIAL PRIMARY KEY,
        machine_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        make_model VARCHAR(150),
        capacity VARCHAR(255),
        accuracy VARCHAR(150),
        quantity INTEGER DEFAULT 1,
        image_url TEXT,
        sort_order INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Quote Inquiries / RFQ CRM
    await client.query(`
      CREATE TABLE IF NOT EXISTS quote_inquiries (
        id SERIAL PRIMARY KEY,
        rfq_number VARCHAR(100) UNIQUE,
        customer_name VARCHAR(150) NOT NULL,
        company_name VARCHAR(150),
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        service_type VARCHAR(100),
        material_preference VARCHAR(150),
        estimated_quantity VARCHAR(100),
        target_date VARCHAR(50),
        specifications_notes TEXT,
        status VARCHAR(50) DEFAULT 'New',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Admin Users
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'superadmin',
        full_name VARCHAR(150) DEFAULT 'Plant Director',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);

    // 8. Billing Customers
    await client.query(`
      CREATE TABLE IF NOT EXISTS billing_customers (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(200) NOT NULL,
        company_name VARCHAR(200),
        gstin VARCHAR(50),
        email VARCHAR(150),
        phone VARCHAR(50),
        billing_address TEXT,
        shipping_address TEXT,
        state VARCHAR(100) DEFAULT 'Tamil Nadu',
        state_code VARCHAR(10) DEFAULT '33',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 9. Billing Invoices
    await client.query(`
      CREATE TABLE IF NOT EXISTS billing_invoices (
        id SERIAL PRIMARY KEY,
        invoice_number VARCHAR(100) UNIQUE NOT NULL,
        invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
        due_date DATE,
        challan_number VARCHAR(100),
        customer_id INTEGER REFERENCES billing_customers(id) ON DELETE SET NULL,
        customer_name VARCHAR(200) NOT NULL,
        customer_gstin VARCHAR(50),
        billing_address TEXT,
        place_of_supply VARCHAR(100) DEFAULT 'Tamil Nadu (33)',
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        subtotal NUMERIC(14,2) NOT NULL DEFAULT 0.00,
        cgst_rate NUMERIC(5,2) DEFAULT 9.00,
        total_cgst NUMERIC(14,2) NOT NULL DEFAULT 0.00,
        sgst_rate NUMERIC(5,2) DEFAULT 9.00,
        total_sgst NUMERIC(14,2) NOT NULL DEFAULT 0.00,
        igst_rate NUMERIC(5,2) DEFAULT 0.00,
        total_igst NUMERIC(14,2) NOT NULL DEFAULT 0.00,
        round_off NUMERIC(6,2) DEFAULT 0.00,
        grand_total NUMERIC(14,2) NOT NULL DEFAULT 0.00,
        amount_in_words TEXT,
        payment_status VARCHAR(50) DEFAULT 'Unpaid',
        payment_mode VARCHAR(50) DEFAULT 'Bank Transfer (NEFT/RTGS)',
        notes TEXT DEFAULT 'Goods once sold will not be taken back. Interest @18% p.a. will be charged for delayed payments.',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 10. Audit Logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        entity VARCHAR(100) NOT NULL,
        details TEXT,
        ip_address VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('[DB] Schema verified successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DB] Schema migration failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

