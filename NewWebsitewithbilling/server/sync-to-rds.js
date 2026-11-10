import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

// Connection configuration for the SSH Tunnel on port 15432
const tunnelConfig = {
  host: process.env.RDS_HOST || '127.0.0.1',
  port: parseInt(process.env.RDS_TUNNEL_PORT || '15432', 10),
  user: process.env.RDS_USER || process.env.PGUSER || 'postgres',
  password: process.env.RDS_PASSWORD || process.env.PGPASSWORD || 'Beon@994182',
  database: process.env.RDS_DATABASE || process.env.PGDATABASE || 'postgres',
  ssl: { rejectUnauthorized: false }, // RDS supports/requires SSL
  connectionTimeoutMillis: 10000,
};

console.log('====================================================');
console.log('🚀 Sri Sakthi Industries - AWS RDS Migration Tool');
console.log(`Connecting via Tunnel: ${tunnelConfig.host}:${tunnelConfig.port}`);
console.log(`Target Database:      ${tunnelConfig.database}`);
console.log(`Target Username:      ${tunnelConfig.user}`);
console.log('====================================================');

async function migrate() {
  let pool = new Pool(tunnelConfig);

  try {
    // 1. Test basic connection
    console.log('[1/5] Testing connection to Amazon RDS through tunnel...');
    const testRes = await pool.query('SELECT version(), current_database(), current_user;');
    console.log(`✅ Connected to RDS successfully!`);
    console.log(`   PostgreSQL Version: ${testRes.rows[0].version.split(',')[0]}`);
    console.log(`   Connected DB:       ${testRes.rows[0].current_database}`);
    console.log(`   User:               ${testRes.rows[0].current_user}`);

    // 2. Check if srisakthi_db exists, if not create it (when connected to 'postgres')
    if (testRes.rows[0].current_database !== 'srisakthi_db') {
      console.log('[2/5] Checking if "srisakthi_db" database exists on RDS...');
      const dbCheck = await pool.query("SELECT 1 FROM pg_database WHERE datname = 'srisakthi_db'");
      if (dbCheck.rows.length === 0) {
        console.log('Creating database "srisakthi_db" on RDS...');
        await pool.query('CREATE DATABASE srisakthi_db;');
        console.log('✅ Database "srisakthi_db" created!');
      } else {
        console.log('✅ Database "srisakthi_db" already exists on RDS.');
      }

      // Reconnect pool directly to srisakthi_db
      await pool.end();
      pool = new Pool({ ...tunnelConfig, database: 'srisakthi_db' });
    }

    // 3. Create Schema Tables
    console.log('[3/5] Creating application tables in RDS...');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Company Settings
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

      // Hero Content
      await client.query(`
        CREATE TABLE IF NOT EXISTS hero_content (
          id SERIAL PRIMARY KEY,
          badge_text VARCHAR(255) DEFAULT 'IATF 16949 & ISO 9001:2015 Precision Machine Shop',
          headline TEXT DEFAULT 'Ultra-Tight Tolerance CNC Machining & Mechanical Manufacturing',
          subheadline TEXT DEFAULT 'Delivering micron-level accuracy (±0.005mm) for automotive OEMs, defense contractors, and heavy engineering with guaranteed zero-defect batch traceability.',
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

      // About Content
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

      // Services & Products
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

      // Machinery
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

      // RFQ Inquiries
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

      // Admin Users
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

      // Billing Customers
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

      // Billing Invoices
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

      // Audit Logs
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
      console.log('✅ All 10 relational tables verified in RDS.');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    // 4. Seed Essential Data
    console.log('[4/5] Populating company profile, catalog, and admin credentials in RDS...');
    const compCount = await pool.query('SELECT COUNT(*) FROM company_settings');
    if (parseInt(compCount.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO company_settings (
          company_name, tagline, logo_url, phone_primary, phone_secondary,
          email_primary, email_sales, address_line1, address_line2,
          city, state, postal_code, country, gstin, pan, working_hours,
          about_short, footer_text, bank_name, bank_account_no, bank_ifsc, bank_branch
        ) VALUES (
          'Sri Sakthi Industries',
          'Precision Mechanical Engineering, CNC Machining & High-Reliability Manufacturing',
          '/assets/logo300 x 100.png',
          '+91 99418 20000',
          '+91 94440 12345',
          'contact@srisakthiindustries.com',
          'rfq@srisakthiindustries.com',
          'Plot No. 42 & 43, SIDCO Industrial Estate',
          'Ambattur / Sriperumbudur Industrial Corridor',
          'Chennai',
          'Tamil Nadu',
          '600058',
          'India',
          '33AAECS1234F1Z5',
          'AAECS1234F',
          'Mon - Sat: 8:30 AM - 6:30 PM (Machining Units 24/7)',
          'Founded in 1999, Sri Sakthi Industries is a trusted ISO 9001 & IATF 16949-aligned precision mechanical manufacturing enterprise specializing in high-speed CNC turning, multi-axis VMC milling, press tooling, and job-work solutions.',
          '© 2026 Sri Sakthi Industries (srisakthiindustries.com). All Rights Reserved. Engineered for Zero-Defect Precision.',
          'State Bank of India',
          '309876543210',
          'SBIN0001234',
          'Industrial Estate Branch, Chennai'
        );
      `);
      console.log('✅ Company settings seeded.');
    }

    const heroCount = await pool.query('SELECT COUNT(*) FROM hero_content');
    if (parseInt(heroCount.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO hero_content (
          badge_text, headline, subheadline, primary_cta_text, primary_cta_link,
          secondary_cta_text, secondary_cta_link, bg_image_url,
          stat1_value, stat1_label, stat2_value, stat2_label,
          stat3_value, stat3_label, stat4_value, stat4_label
        ) VALUES (
          'IATF 16949 & ISO 9001:2015 Precision Machine Shop',
          'Ultra-Tight Tolerance CNC Machining & High-Reliability Manufacturing',
          'Delivering micron-level accuracy (±0.005mm) for automotive OEMs, defense contractors, and heavy engineering with guaranteed zero-defect batch traceability.',
          'Request Instant RFQ',
          '#quote',
          'Explore Capabilities',
          '#services',
          '/assets/backgroundcnc.jpg',
          '25+', 'Years Experience',
          '±0.005 mm', 'Precision Tolerance',
          '99.8%', 'On-Time Delivery',
          '500K+', 'Parts / Month'
        );
      `);
      console.log('✅ Hero content seeded.');
    }

    const aboutCount = await pool.query('SELECT COUNT(*) FROM about_content');
    if (parseInt(aboutCount.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO about_content (
          section_title, headline, description_para1, description_para2,
          mission, vision, facility_area, machinist_strength
        ) VALUES (
          'About Sri Sakthi Industries',
          'Engineering Perfection with Sub-Micron Repeatability',
          'Sri Sakthi Industries is a benchmark manufacturer in the southern industrial corridor of Chennai, Tamil Nadu.',
          'Equipped with Japanese and Korean multi-axis CNC Turning Centers, high-speed VMC milling stations, automatic Traub lathes, and Mitutoyo 3D Coordinate Measuring Machines (CMM).',
          'To empower global manufacturing with uncompromised precision, rapid turnaround, and zero-defect components.',
          'To be the preferred precision mechanical engineering and contract manufacturing partner recognized worldwide.',
          '35,000 Sq. Ft. Manufacturing Plant',
          '120+ Dedicated Engineers & Machinists'
        );
      `);
      console.log('✅ About content seeded.');
    }

    // Admin user
    const adminCount = await pool.query("SELECT COUNT(*) FROM admin_users WHERE username = 'admin'");
    if (parseInt(adminCount.rows[0].count, 10) === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('Beon@994182', salt);
      await pool.query(`
        INSERT INTO admin_users (username, email, password_hash, role, full_name)
        VALUES ('admin', 'admin@srisakthiindustries.com', $1, 'superadmin', 'Managing Director - Sri Sakthi Industries')
      `, [hash]);
      console.log('✅ Admin user created (admin / Beon@994182).');
    }

    // Services & products
    const prodCount = await pool.query('SELECT COUNT(*) FROM services_products');
    if (parseInt(prodCount.rows[0].count, 10) === 0) {
      const products = [
        ['Precision CNC Turning & Turn-Mill', 'CNC Machining', 'High-speed 2-axis to 5-axis CNC turning for complex shafts, flanges, and rotational parts.', 'Tolerance within ±0.005mm.', '/assets/backgroundcnc.jpg', 1],
        ['Multi-Axis VMC Milling & 3D Profiling', 'VMC Machining', 'Advanced 3-Axis & 4-Axis Vertical Machining Centers for intricate prismatic components.', 'High precision aerospace and automotive parts.', '/assets/backgroundcnc.jpg', 2],
        ['Automatic Traub Lathe High-Volume Job Work', 'Job Work', 'High-speed mass production for small precision pins, bushes, spacers, and fasteners.', 'Up to 35,000 parts daily.', '/assets/backgroundcnc.jpg', 3],
        ['Sheet Metal Stamping, Press Tools & Fabrication', 'Fabrication', 'Heavy power presses from 30T to 250T for progressive die stamping.', 'Automotive brackets and enclosures.', '/assets/backgroundcnc.jpg', 4],
        ['IATF 16949 Metrology & Quality Lab', 'Metrology', 'Mitutoyo 3D CMM and digital SPC testing room.', 'Cp/Cpk > 1.67 inspection.', '/assets/backgroundcnc.jpg', 5],
        ['Heat Treatment & Surface Finishing', 'Surface Treatment', 'Case hardening, zinc plating, anodizing meeting 720h salt spray.', 'ASTM B117 compliance.', '/assets/backgroundcnc.jpg', 6]
      ];
      for (const p of products) {
        await pool.query(`
          INSERT INTO services_products (title, category, summary, description, image_url, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, p);
      }
      console.log('✅ Services & Products catalog seeded.');
    }

    // 5. Final report
    console.log('[5/5] Verifying RDS dataset summary...');
    const [comp, prods, users, bills] = await Promise.all([
      pool.query('SELECT company_name FROM company_settings LIMIT 1'),
      pool.query('SELECT count(*) FROM services_products'),
      pool.query('SELECT count(*) FROM admin_users'),
      pool.query('SELECT count(*) FROM billing_invoices')
    ]);

    console.log('====================================================');
    console.log('🎉 SUCCESS! Amazon RDS Database Initialized & Synchronized!');
    console.log(`   Company:   ${comp.rows[0]?.company_name}`);
    console.log(`   Products:  ${prods.rows[0]?.count} items`);
    console.log(`   Admin:     ${users.rows[0]?.count} active users`);
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('👉 Tip: Ensure your SSH tunnel on port 15432 is running in a background terminal!');
    }
  } finally {
    await pool.end();
  }
}

migrate();
