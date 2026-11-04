import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { pool } from './db.js';
import { seedInitialData } from './seed.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import inquiriesRoutes from './routes/inquiries.js';
import billingRoutes from './routes/billing.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve Public Static Assets (logos, background images, uploads)
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));
app.use('/assets', express.static(path.join(publicDir, 'assets')));
app.use('/uploads', express.static(path.join(publicDir, 'uploads')));

// Health & System Info Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbTest = await pool.query('SELECT current_database(), version(), inet_server_port();');
    res.json({
      status: 'UP',
      system: 'Sri Sakthi Industries - Enterprise Web & Billing Platform',
      database: dbTest.rows[0].current_database,
      dbPort: dbTest.rows[0].inet_server_port,
      pgVersion: dbTest.rows[0].version.split(' ')[1],
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      pgAdminGuide: {
        host: '127.0.0.1',
        port: dbTest.rows[0].inet_server_port || 5433,
        user: 'postgres',
        password: process.env.PGPASSWORD || 'Beon@994182',
        database: 'srisakthi_db'
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      error: err.message,
      troubleshoot: 'Verify PostgreSQL 18 is running on port 5433 or 5432'
    });
  }
});

// Mount Application API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/upload', uploadRoutes);

// Serve Production Frontend SPA if dist folder exists
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(distDir, 'index.html'));
    }
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Startup & Auto Database Initialization
async function startServer() {
  try {
    console.log('[System] Verifying and seeding PostgreSQL database...');
    await seedInitialData();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(`  Sri Sakthi Industries Platform Engine Started!`);
      console.log(`  Backend API:  http://localhost:${PORT}`);
      console.log(`  PostgreSQL:   Port ${process.env.PGPORT || 5433} (DB: ${process.env.PGDATABASE || 'srisakthi_db'})`);
      console.log(`  pgAdmin User: ${process.env.PGUSER || 'postgres'}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Fatal initialization error:', err);
    process.exit(1);
  }
}

startServer();

