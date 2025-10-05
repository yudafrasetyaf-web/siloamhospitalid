import { Router } from 'express';
import { body } from 'express-validator';
import * as doctorController from '../controllers/doctorController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { UserRole } from '../models/User';

const router = Router();

// Create doctor validation
const createDoctorValidation = [
  body('userId').isInt().withMessage('Valid user ID is required'),
  body('specialization').notEmpty().withMessage('Specialization is required'),
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('yearsOfExperience').isInt({ min: 0 }).withMessage('Years of experience must be a positive number'),
  body('education').notEmpty().withMessage('Education is required'),
  body('consultationFee').isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number')
];

// Public routes
router.get('/', doctorController.getAllDoctors);
router.get('/specializations', doctorController.getSpecializations);
router.get('/:id', doctorController.getDoctorById);

// Protected routes (Admin only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createDoctorValidation),
  doctorController.createDoctor
);
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.DOCTOR),
  doctorController.updateDoctor
);
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  doctorController.deleteDoctor
);

export default router;
