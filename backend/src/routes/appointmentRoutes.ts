import { Router } from 'express';
import { body } from 'express-validator';
import * as appointmentController from '../controllers/appointmentController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { UserRole } from '../models/User';

const router = Router();

// Create appointment validation
const createAppointmentValidation = [
  body('doctorId').isInt().withMessage('Valid doctor ID is required'),
  body('appointmentDate').isDate().withMessage('Valid appointment date is required'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
  body('reasonForVisit').notEmpty().withMessage('Reason for visit is required')
];

// Protected routes
router.use(authenticate);

router.post('/', validate(createAppointmentValidation), appointmentController.createAppointment);
router.get('/my-appointments', appointmentController.getMyAppointments);
router.get('/doctor/:doctorId', authorize(UserRole.DOCTOR, UserRole.ADMIN), appointmentController.getDoctorAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id/status', authorize(UserRole.DOCTOR, UserRole.ADMIN), appointmentController.updateAppointmentStatus);
router.put('/:id/cancel', appointmentController.cancelAppointment);

export default router;
