import express from 'express';
import {
  getSpecializations,
  getSpecialization,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization
} from '../controllers/specializationController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Specializations
 *   description: Medical specializations and services management
 */

/**
 * @swagger
 * /api/v1/specializations:
 *   get:
 *     summary: Get all medical specializations
 *     tags: [Specializations]
 *     responses:
 *       200:
 *         description: List of all specializations
 */
router.get('/', getSpecializations);

/**
 * @swagger
 * /api/v1/specializations/{id}:
 *   get:
 *     summary: Get single specialization by ID
 *     tags: [Specializations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Specialization details
 *       404:
 *         description: Specialization not found
 */
router.get('/:id', getSpecialization);

/**
 * @swagger
 * /api/v1/specializations:
 *   post:
 *     summary: Create new specialization
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Specialization created
 *       400:
 *         description: Specialization already exists
 */
router.post('/', authenticate, authorize(UserRole.ADMIN), createSpecialization);

/**
 * @swagger
 * /api/v1/specializations/{id}:
 *   put:
 *     summary: Update specialization
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Specialization updated
 *       404:
 *         description: Specialization not found
 */
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateSpecialization);

/**
 * @swagger
 * /api/v1/specializations/{id}:
 *   delete:
 *     summary: Delete specialization
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Specialization deleted
 *       404:
 *         description: Specialization not found
 */
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteSpecialization);

export default router;
