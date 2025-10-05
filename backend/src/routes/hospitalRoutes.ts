import { Router } from 'express';
import { body } from 'express-validator';
import * as hospitalController from '../controllers/hospitalController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { UserRole } from '../models/User';

const router = Router();

// Create hospital validation
const createHospitalValidation = [
  body('name').notEmpty().withMessage('Hospital name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('province').notEmpty().withMessage('Province is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('emergencyNumber').notEmpty().withMessage('Emergency number is required')
];

// Public routes
router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);

// Protected routes (Admin only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createHospitalValidation),
  hospitalController.createHospital
);
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  hospitalController.updateHospital
);
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  hospitalController.deleteHospital
);

export default router;
