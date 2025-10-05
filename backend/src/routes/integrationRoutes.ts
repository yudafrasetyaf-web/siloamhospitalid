import { Router } from 'express';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Dummy endpoint integrasi BPJS
router.post('/bpjs/claim', authenticate, (req, res) => {
  // Integrasi ke API BPJS bisa diimplementasikan di sini
  res.json({ success: true, message: 'BPJS claim sent (dummy endpoint)' });
});

// Dummy endpoint integrasi laboratorium eksternal
router.post('/lab/external', authenticate, (req, res) => {
  // Integrasi ke API laboratorium eksternal bisa diimplementasikan di sini
  res.json({ success: true, message: 'External lab result sent (dummy endpoint)' });
});

// Dummy endpoint integrasi farmasi eksternal
router.post('/pharmacy/external', authenticate, (req, res) => {
  // Integrasi ke API farmasi eksternal bisa diimplementasikan di sini
  res.json({ success: true, message: 'External pharmacy prescription sent (dummy endpoint)' });
});

export default router;
