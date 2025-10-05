import { Router } from 'express';
import {
  createLabResult,
  getLabResultById,
  getLabResultsByPatient,
  getLabResultsByDoctor,
  getLabResultsByAppointment,
  updateLabResult,
  deleteLabResult
} from '../controllers/labResultController';
import { authenticate } from '../middlewares/auth';
import { auditMiddleware, auditModificationMiddleware } from '../middlewares/auditLogger';

const router = Router();

router.post('/', authenticate, auditModificationMiddleware('LabResult'), createLabResult);
router.get('/:id', authenticate, auditMiddleware('LabResult'), getLabResultById);
router.get('/patient/:patientId', authenticate, auditMiddleware('LabResult'), getLabResultsByPatient);
router.get('/doctor/:doctorId', authenticate, auditMiddleware('LabResult'), getLabResultsByDoctor);
router.get('/appointment/:appointmentId', authenticate, auditMiddleware('LabResult'), getLabResultsByAppointment);
router.put('/:id', authenticate, auditModificationMiddleware('LabResult'), updateLabResult);
router.delete('/:id', authenticate, auditModificationMiddleware('LabResult'), deleteLabResult);

export default router;
