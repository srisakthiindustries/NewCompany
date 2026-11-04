import bcrypt from 'bcryptjs';
import { query, initializeDatabase } from './db.js';

export async function seedInitialData() {
  try {
    await initializeDatabase();

    // 1. Check & Seed Company Settings
    const compRes = await query('SELECT COUNT(*) FROM company_settings');
    if (parseInt(compRes.rows[0].count, 10) === 0) {
      console.log('[Seed] Inserting default company settings...');
      await query(`
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
          'Founded in 1999, Sri Sakthi Industries is a trusted ISO 9001 & IATF 16949-aligned precision mechanical manufacturing enterprise specializing in high-speed CNC turning, multi-axis VMC milling, press tooling, and job-work solutions for automotive, defense, and power industries.',
          '© 2026 Sri Sakthi Industries (srisakthiindustries.com). All Rights Reserved. Engineered for Zero-Defect Precision.',
          'State Bank of India',
          '309876543210',
          'SBIN0001234',
          'Industrial Estate Branch, Chennai'
        );
      `);
    }

    // 2. Check & Seed Hero Content
    const heroRes = await query('SELECT COUNT(*) FROM hero_content');
    if (parseInt(heroRes.rows[0].count, 10) === 0) {
      console.log('[Seed] Inserting default hero content...');
      await query(`
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
    }

    // 3. Check & Seed About Content
    const aboutRes = await query('SELECT COUNT(*) FROM about_content');
    if (parseInt(aboutRes.rows[0].count, 10) === 0) {
      console.log('[Seed] Inserting default about content...');
      await query(`
        INSERT INTO about_content (
          section_title, headline, description_para1, description_para2,
          mission, vision, facility_area, machinist_strength
        ) VALUES (
          'About Sri Sakthi Industries',
          'Engineering Perfection with Sub-Micron Repeatability',
          'Sri Sakthi Industries is a benchmark manufacturer in the southern industrial corridor of Chennai, Tamil Nadu. With over two decades of technical expertise, our facilities house state-of-the-art multi-axis CNC Turning Centers, high-precision Vertical Machining Centers (VMCs), automatic Traub lathes, and comprehensive surface treatment lines.',
          'From single-piece prototypes to high-volume automotive production runs, our robust quality management framework encompasses AIAG APQP, PPAP Level 3 documentation, Mitutoyo 3D CMM inspections, and full material heat-number traceability.',
          'To empower global manufacturing with uncompromised precision, rapid turnaround, and zero-defect components through lean manufacturing and automated quality gates.',
          'To be the preferred precision mechanical engineering and contract manufacturing partner recognized worldwide for technical innovation, sustainable practices, and quality leadership.',
          '35,000 Sq. Ft. Manufacturing Plant',
          '120+ Dedicated Engineers & Machinists'
        );
      `);
    }

    // 4. Check & Seed Services & Products
    const prodRes = await query('SELECT COUNT(*) FROM services_products');
    if (parseInt(prodRes.rows[0].count, 10) === 0) {
      console.log('[Seed] Inserting default services & products...');
      const products = [
        {
          title: 'Precision CNC Turning & Turn-Mill',
          category: 'CNC Machining',
          summary: 'High-speed 2-axis to 5-axis CNC turning for complex shafts, flanges, and rotational parts.',
          description: 'Our CNC turning division features high-rigidity machines capable of turning hardened alloys, aerospace-grade stainless steel (SS316L, 17-4PH), titanium, brass, and aluminum with surface finishes down to Ra 0.2 µm and dimensional tolerances within ±0.005mm.',
          specifications: JSON.stringify([
            { label: 'Max Turning Diameter', value: '450 mm' },
            { label: 'Max Turning Length', value: '1,200 mm' },
            { label: 'Spindle Speed', value: 'Up to 6,000 RPM' },
            { label: 'Tolerance Gate', value: '±0.005 mm' },
            { label: 'Materials', value: 'Alloy Steel (EN8, EN19, EN24, EN36), SS304/316, Brass, Al 6061/7075' }
          ]),
          image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          sort_order: 1
        },
        {
          title: 'Multi-Axis VMC Milling & 3D Profiling',
          category: 'VMC Machining',
          summary: 'Advanced 3-Axis & 4-Axis Vertical Machining Centers for intricate prismatic engineering components.',
          description: 'Equipped with 30-tool automatic tool changers, high-pressure through-spindle coolant, and optical tool touch probes. Ideal for aerospace brackets, automotive gear housings, hydraulic manifolds, and custom tooling blocks.',
          specifications: JSON.stringify([
            { label: 'X/Y/Z Axis Travel', value: '1050 x 530 x 510 mm' },
            { label: 'Table Size', value: '1200 x 500 mm' },
            { label: 'Table Load Capacity', value: '800 kg' },
            { label: 'Spindle Power', value: '15 kW, 12,000 RPM' },
            { label: 'Control Systems', value: 'Fanuc 0i-MF Plus & Siemens 828D' }
          ]),
          image_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          sort_order: 2
        },
        {
          title: 'Automatic Traub Lathe High-Volume Job Work',
          category: 'Job Work',
          summary: 'High-speed mass production for small precision pins, bushes, spacers, and fasteners.',
          description: 'Dedicated battery of automatic single-spindle Traub lathes optimized for economical 24/7 continuous run manufacturing. Capable of processing 10,000+ parts daily with integrated bar-feeders and automated parting.',
          specifications: JSON.stringify([
            { label: 'Bar Capacity', value: 'Ø 3 mm to Ø 60 mm' },
            { label: 'Daily Output', value: '35,000+ pieces' },
            { label: 'Secondary Operations', value: 'Thread rolling, slotting, deburring, cross-drilling' },
            { label: 'Typical Parts', value: 'Automotive dowel pins, nozzle tips, threaded spacers, studs' }
          ]),
          image_url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
          sort_order: 3
        },
        {
          title: 'Sheet Metal Stamping, Press Tools & Fabrication',
          category: 'Fabrication',
          summary: 'Heavy mechanical power presses from 30T to 250T for progressive die stamping and forming.',
          description: 'In-house tool design and maintenance room for progressive, compound, and deep-drawing dies. Serving automotive body brackets, heat-shield stampings, electrical terminals, and welded sub-assemblies.',
          specifications: JSON.stringify([
            { label: 'Press Tonnage Range', value: '30 Ton to 250 Ton' },
            { label: 'Sheet Thickness', value: '0.5 mm to 6.0 mm' },
            { label: 'Die Capabilities', value: 'Progressive, Blanking, Piercing, Bending, Deep Draw' },
            { label: 'Welding Facilities', value: 'MIG, TIG, Robotic Spot Welding' }
          ]),
          image_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          sort_order: 4
        },
        {
          title: 'IATF 16949 Metrology & Quality Lab',
          category: 'Metrology',
          summary: 'Dedicated temperature-controlled standards room equipped with Mitutoyo 3D CMM and SPC systems.',
          description: 'Every production batch is gated through rigorous Statistical Process Control (Cp/Cpk > 1.67), Mitutoyo Crysta-Apex coordinate measuring machines, optical profile projectors, digital surface roughness testers, and hardness testing.',
          specifications: JSON.stringify([
            { label: 'CMM Measuring Range', value: '700 x 1000 x 600 mm' },
            { label: 'CMM Probing Accuracy', value: 'E0,MPE = (1.7 + 3L/1000) µm' },
            { label: 'Surface Tester', value: 'Mitutoyo Surftest SJ-410 (Ra, Rz, Rq)' },
            { label: 'Documentation', value: 'PPAP Level 1-5, FAI, Raw Material Mill Test Certificates (MTC)' }
          ]),
          image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
          sort_order: 5
        },
        {
          title: 'Specialized Heat Treatment & Surface Finishing',
          category: 'Surface Treatment',
          summary: 'Comprehensive hardening, zinc-nickel plating, anodizing, phosphating, and blackening.',
          description: 'Qualified partner ecosystem for vacuum carburizing, induction hardening, induction annealing, and anti-corrosion finishes meeting stringent salt-spray ASTM B117 requirements (up to 720 hours red rust free).',
          specifications: JSON.stringify([
            { label: 'Hardening Methods', value: 'Case Carburizing (58-62 HRC), Induction Hardening, Nitriding' },
            { label: 'Plating Types', value: 'Trivalent Blue/Yellow Zinc, Zinc-Nickel, Hard Chrome, Anodizing' },
            { label: 'Corrosion Resistance', value: '240h - 720h Salt Spray (NSS)' }
          ]),
          image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          sort_order: 6
        }
      ];

      for (const p of products) {
        await query(`
          INSERT INTO services_products (
            title, category, summary, description, specifications, image_url, sort_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [p.title, p.category, p.summary, p.description, p.specifications, p.image_url, p.sort_order]);
      }
    }

    // 5. Check & Seed Machinery
    const machRes = await query('SELECT COUNT(*) FROM machinery_equipment');
    if (parseInt(machRes.rows[0].count, 10) === 0) {
      console.log('[Seed] Inserting default machinery...');
      const machines = [
        {
          machine_name: 'Mazak VTC-800/30SR 5-Axis VMC',
          category: 'VMC Machining',
          make_model: 'Yamazaki Mazak, Japan',
          capacity: 'X: 3000mm, Y: 800mm, Z: 720mm | 18,000 RPM Spindle',
          accuracy: '±0.003 mm Positional | ±0.002 mm Repeatability',
          quantity: 2,
          image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          sort_order: 1
        },
        {
          machine_name: 'Doosan Lynx 2100LSY CNC Turning Center',
          category: 'CNC Turning',
          make_model: 'DN Solutions / Doosan, South Korea',
          capacity: 'Max Turning Ø: 300mm, Length: 510mm | Sub-Spindle & Live Tooling',
          accuracy: '±0.004 mm Diameter Consistency',
          quantity: 4,
          image_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          sort_order: 2
        },
        {
          machine_name: 'Mitutoyo Crysta-Apex V9106 CNC CMM',
          category: 'Metrology & CMM',
          make_model: 'Mitutoyo Corporation, Japan',
          capacity: 'Measuring Volume: 900 x 1000 x 600 mm',
          accuracy: 'E0,MPE: 1.7 + 3L/1000 µm Sub-micron probing',
          quantity: 1,
          image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
          sort_order: 3
        },
        {
          machine_name: 'Automatic Traub Lathes TC-32 / TC-60',
          category: 'Traub Lathes',
          make_model: 'Traub Mechanical Systems',
          capacity: 'Bar stock feed Ø 10mm - Ø 60mm | 24x7 Continuous Feed',
          accuracy: '±0.015 mm High-Speed Production',
          quantity: 12,
          image_url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
          sort_order: 4
        },
        {
          machine_name: 'Mechanical Stamping Power Presses (30T - 250T)',
          category: 'Stamping Press',
          make_model: 'Aida & Godrej Precision Presses',
          capacity: 'Up to 250 Metric Tonnes with decoiler & straightener',
          accuracy: 'Die alignment ±0.01 mm',
          quantity: 6,
          image_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          sort_order: 5
        }
      ];

      for (const m of machines) {
        await query(`
          INSERT INTO machinery_equipment (
            machine_name, category, make_model, capacity, accuracy, quantity, image_url, sort_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [m.machine_name, m.category, m.make_model, m.capacity, m.accuracy, m.quantity, m.image_url, m.sort_order]);
      }
    }

    // 6. Check & Seed Admin User (username: admin, pass: Beon@994182)
    const adminRes = await query("SELECT COUNT(*) FROM admin_users WHERE username = 'admin'");
    if (parseInt(adminRes.rows[0].count, 10) === 0) {
      console.log('[Seed] Creating default admin user (admin / Beon@994182)...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('Beon@994182', salt);
      await query(`
        INSERT INTO admin_users (username, email, password_hash, role, full_name)
        VALUES ('admin', 'admin@srisakthiindustries.com', $1, 'superadmin', 'Managing Director - Sri Sakthi Industries')
      `, [hash]);
    }

    // 7. Check & Seed Billing Customers
    const custRes = await query('SELECT COUNT(*) FROM billing_customers');
    if (parseInt(custRes.rows[0].count, 10) === 0) {
      console.log('[Seed] Creating default billing customers...');
      await query(`
        INSERT INTO billing_customers (
          customer_name, company_name, gstin, email, phone,
          billing_address, shipping_address, state, state_code
        ) VALUES 
        (
          'Mr. R. Sundaram (Plant Head)',
          'Lucas TVS Precision Components Ltd',
          '33AABCL1234K1ZV',
          'purchase@lucastvs.com',
          '+91 44 2625 1200',
          'Padi Industrial Area, Chennai - 600050',
          'Lucas TVS Plant 2, Irungattukottai, SIPCOT Industrial Park - 602105',
          'Tamil Nadu',
          '33'
        ),
        (
          'Mr. Arvind Kumar (DGM Sourcing)',
          'Sundram Fasteners Automotive Division',
          '33AAACS5678J1Z0',
          'arvind.k@sundram.com',
          '+91 44 2855 5000',
          '98-A, VII Floor, Dr. Radhakrishnan Salai, Mylapore, Chennai - 600004',
          'Sundram Fasteners Special Components Plant, Aviur - 626115',
          'Tamil Nadu',
          '33'
        ),
        (
          'Mr. K. Vignesh (Senior Manager Quality)',
          'Brakes India Private Limited',
          '33AAACB9876H1ZR',
          'vignesh.k@brakesindia.co.in',
          '+91 44 2625 8161',
          'Padi, Chennai - 600050, Tamil Nadu',
          'Brakes India Foundry & Machining Division, Sholinghur - 631102',
          'Tamil Nadu',
          '33'
        );
      `);
    }

    // 8. Check & Seed Sample Invoices
    const invRes = await query('SELECT COUNT(*) FROM billing_invoices');
    if (parseInt(invRes.rows[0].count, 10) === 0) {
      console.log('[Seed] Creating initial sample invoice...');
      const sampleItems = JSON.stringify([
        {
          item_desc: 'CNC Turn-Milled Spline Shaft (EN24 Hardened 52 HRC)',
          hsn_sac: '8483',
          quantity: 250,
          uom: 'NOS',
          rate: 480.00,
          taxable_amount: 120000.00,
          gst_rate: 18.00,
          cgst_amount: 10800.00,
          sgst_amount: 10800.00,
          igst_amount: 0.00,
          total: 141600.00
        },
        {
          item_desc: 'Precision Traub Turned Brass Bushing (CuZn39Pb3)',
          hsn_sac: '8482',
          quantity: 1200,
          uom: 'NOS',
          rate: 32.50,
          taxable_amount: 39000.00,
          gst_rate: 18.00,
          cgst_amount: 3510.00,
          sgst_amount: 3510.00,
          igst_amount: 0.00,
          total: 46020.00
        }
      ]);

      await query(`
        INSERT INTO billing_invoices (
          invoice_number, invoice_date, due_date, challan_number, customer_id,
          customer_name, customer_gstin, billing_address, place_of_supply,
          items, subtotal, cgst_rate, total_cgst, sgst_rate, total_sgst,
          round_off, grand_total, amount_in_words, payment_status, notes
        ) VALUES (
          'SSI/INV/2026-27/0042',
          CURRENT_DATE,
          CURRENT_DATE + INTERVAL '30 days',
          'DC/2026/0189',
          1,
          'Lucas TVS Precision Components Ltd',
          '33AABCL1234K1ZV',
          'Padi Industrial Area, Chennai - 600050',
          'Tamil Nadu (33)',
          $1,
          159000.00,
          9.00,
          14310.00,
          9.00,
          14310.00,
          0.00,
          187620.00,
          'Rupees One Lakh Eighty-Seven Thousand Six Hundred Twenty Only',
          'Paid',
          'Supplied against Purchase Order PO-LTVS-2026-889. MTC & PPAP Level 3 reports attached.'
        );
      `, [sampleItems]);
    }

    // 9. Check & Seed Sample Inquiries
    const inqRes = await query('SELECT COUNT(*) FROM quote_inquiries');
    if (parseInt(inqRes.rows[0].count, 10) === 0) {
      console.log('[Seed] Creating initial quote inquiry...');
      await query(`
        INSERT INTO quote_inquiries (
          rfq_number, customer_name, company_name, email, phone,
          service_type, material_preference, estimated_quantity, target_date,
          specifications_notes, status, admin_notes
        ) VALUES (
          'RFQ-2026-1001',
          'Arun Kumar',
          'Apex Automotive Subsystems',
          'arun@apexauto.in',
          '+91 98400 99881',
          'CNC Turning & Turn-Mill',
          'Stainless Steel 316L',
          '5,000 Pcs/Month',
          'Immediate (Within 15 days)',
          'Requires 2D & 3D STEP file quotation for high-pressure fuel injector adapters with 0.008mm bore concentricity.',
          'In Review',
          'Drawings evaluated by design lead. Quote sent for 5,000 batch.'
        );
      `);
    }

    console.log('[Seed] Database initialization and seeding completed successfully!');
  } catch (err) {
    console.error('[Seed] Error seeding data:', err);
    throw err;
  }
}

