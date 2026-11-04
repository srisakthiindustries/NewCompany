import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'srisakthi_super_secure_jwt_secret_key_2026_industry_lead';

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const userRes = await query(
      'SELECT id, username, email, password_hash, role, full_name FROM admin_users WHERE username = $1 OR email = $1',
      [username.trim()]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // Update last login
    await query('UPDATE admin_users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Generate JWT token (expires in 7 days)
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, fullName: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Audit log
    await query(
      'INSERT INTO audit_logs (action, entity, details, ip_address) VALUES ($1, $2, $3, $4)',
      ['ADMIN_LOGIN', 'admin_users', `User ${user.username} logged into admin console`, req.ip]
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login', error: err.message });
  }
});

// Current User Profile
router.get('/me', authenticateAdmin, async (req, res) => {
  try {
    const userRes = await query(
      'SELECT id, username, email, role, full_name, last_login FROM admin_users WHERE id = $1',
      [req.user.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user: userRes.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

