import express from 'express';
import { authenticate } from '../middlewares/auth';
import { setupMfa, verifyMfa, disableMfa } from '../controllers/mfaController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: MFA
 *   description: Multi-Factor Authentication management
 */

/**
 * @swagger
 * /api/v1/mfa/setup:
 *   post:
 *     summary: Initiate MFA setup
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR code and manual setup key
 *       400:
 *         description: MFA already enabled
 *       401:
 *         description: Not authenticated
 */
router.post('/setup', authenticate, setupMfa);

/**
 * @swagger
 * /api/v1/mfa/verify:
 *   post:
 *     summary: Verify TOTP and enable MFA
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: MFA enabled, returns recovery codes
 *       400:
 *         description: Invalid token
 */
router.post('/verify', authenticate, verifyMfa);

/**
 * @swagger
 * /api/v1/mfa/disable:
 *   post:
 *     summary: Disable MFA
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: MFA disabled
 *       401:
 *         description: Invalid password
 */
router.post('/disable', authenticate, disableMfa);

export default router;
