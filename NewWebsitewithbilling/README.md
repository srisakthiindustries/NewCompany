# Sri Sakthi Industries - Enterprise Web & Billing Platform

Full-stack production platform for **srisakthiindustries.com** built with **Node.js, Express, PostgreSQL 18, React 18, Vite, and Tailwind CSS**.

---

## 🚀 Live Application Access

- **Public Website:** [http://localhost:5000](http://localhost:5000)
- **Admin Control Panel:** Click **"Admin Portal"** on the website header/footer or visit [http://localhost:5000/#admin](http://localhost:5000/#admin)

### 🔐 Admin Credentials
- **Username:** `admin`
- **Password:** `Beon@994182`

---

## 🗄️ PostgreSQL 18 & pgAdmin 4 Connection Details

Connect pgAdmin 4 or any SQL client (DBeaver, TablePlus, psql) using:

| Setting | Value |
| :--- | :--- |
| **Host name / Address** | `127.0.0.1` |
| **Port** | `5433` (or `5432`) |
| **Maintenance Database** | `srisakthi_db` |
| **Username** | `postgres` |
| **Password** | `Beon@994182` |

### CLI Connection
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h 127.0.0.1 -p 5433 -U postgres -d srisakthi_db
```

---

## ⚙️ Features & Architecture

### 1. Dynamic CMS via Admin Panel
- **Company Identity & Logo:** Change the company name, tagline, upload or change logo (live preview), update phone numbers, emails, registered SIDCO address, GSTIN, PAN, working hours, and bank details.
- **Hero & Content Editor:** Modify hero headlines, sub-headlines, badge text, 4 metric counters (Years in industry, tolerance ±0.005mm, on-time delivery %, monthly capacity), and About Us mission & vision statements.
- **Product & Capabilities Catalog:** Add, edit, reorder, or delete precision components, upload part images, and edit technical specifications (tolerances, materials, axis travel).
- **Machine Shop Fleet:** Manage multi-axis CNC Turning Centers, VMCs (Mazak, Doosan), Traub automatic lathes, and Mitutoyo 3D CMM inspection stations.
- **Inquiries / RFQ CRM:** Review customer quote requests, filter by status (New, In Review, Quoted, Approved), view technical specifications, and record internal estimator notes.

### 2. GST Invoicing & Billing System
- **Tax Invoice Generation:** Create GST-compliant tax invoices with automatic sequence numbering (e.g. `SSI/INV/2026-27/0043`).
- **Automated Tax Computations:** Calculates Subtotal, CGST (9%), SGST (9%), IGST (18% for inter-state), Round Off, and Grand Total.
- **Amount in Words Generator:** Automatically converts numeric total into Indian Currency Words (e.g. `Rupees One Lakh Eighty-Seven Thousand Six Hundred Twenty Only`).
- **Printable Tax Invoice:** Formatted with Sri Sakthi Industries branding, customer details, HSN codes, terms & conditions, bank RTGS details, and authorized signature block ready for print (`Ctrl + P`) or PDF download.

---

## 🛠️ Developer Scripts

```powershell
# Start Node.js backend & frontend server
npm run server

# Start Vite live hot-reload development server
npm run dev

# Rebuild frontend bundle
npm run build

# Re-run database schema migration & seed
npm run seed
```
