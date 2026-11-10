import app from '../server/index.js';
import { seedInitialData } from '../server/seed.js';

let isInitialized = false;

export default async function handler(req, res) {
  if (!isInitialized) {
    try {
      console.log('[Vercel Serverless] Checking and initializing database tables on Amazon RDS...');
      await seedInitialData();
      isInitialized = true;
      console.log('[Vercel Serverless] Database ready!');
    } catch (err) {
      console.error('[Vercel Serverless] DB init warning:', err.message);
      // Proceed even if init fails so errors can be inspected
    }
  }

  return app(req, res);
}
