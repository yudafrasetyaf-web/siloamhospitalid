import express from 'express';
import { createEmergencyCase, getEmergencyCases } from '../controllers/emergencyController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Emergency
 *   description: Emergency triage and case management
 */

/**
 * @swagger
 * /api/v1/emergency:
 *   post:
 *     summary: Create new emergency case
 *     tags: [Emergency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               symptoms:
 *                 type: array
 *                 items: { type: string }
 *               vitalSigns:
 *                 type: object
 *     responses:
 *       201:
 *         description: Emergency case created
 */
router.post('/', authenticate, createEmergencyCase);

/**
 * @swagger
 * /api/v1/emergency:
 *   get:
 *     summary: Get pending emergency cases
 *     tags: [Emergency]
 *     responses:
 *       200:
 *         description: List of pending cases
 */
router.get('/', authenticate, getEmergencyCases);

export default router;
