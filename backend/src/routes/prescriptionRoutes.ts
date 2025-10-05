import { Router } from 'express';
import {
  createPrescription,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  getPrescriptionsByAppointment,
  updatePrescription,
  deletePrescription
} from '../controllers/prescriptionController';
import { authenticate } from '../middlewares/auth';
import { auditMiddleware, auditModificationMiddleware } from '../middlewares/auditLogger';

const router = Router();

router.post('/', authenticate, auditModificationMiddleware('Prescription'), createPrescription);
router.get('/:id', authenticate, auditMiddleware('Prescription'), getPrescriptionById);
router.get('/patient/:patientId', authenticate, auditMiddleware('Prescription'), getPrescriptionsByPatient);
router.get('/doctor/:doctorId', authenticate, auditMiddleware('Prescription'), getPrescriptionsByDoctor);
router.get('/appointment/:appointmentId', authenticate, auditMiddleware('Prescription'), getPrescriptionsByAppointment);
router.put('/:id', authenticate, auditModificationMiddleware('Prescription'), updatePrescription);
router.delete('/:id', authenticate, auditModificationMiddleware('Prescription'), deletePrescription);

export default router;
