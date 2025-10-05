import { Router } from 'express';
import {
  createInpatient,
  getInpatientById,
  getInpatientsByPatient,
  getInpatientsByDoctor,
  getInpatientsByAppointment,
  updateInpatient,
  deleteInpatient
} from '../controllers/inpatientController';
import { authenticate } from '../middlewares/auth';
import { auditMiddleware, auditModificationMiddleware } from '../middlewares/auditLogger';

const router = Router();

router.post('/', authenticate, auditModificationMiddleware('Inpatient'), createInpatient);
router.get('/:id', authenticate, auditMiddleware('Inpatient'), getInpatientById);
router.get('/patient/:patientId', authenticate, auditMiddleware('Inpatient'), getInpatientsByPatient);
router.get('/doctor/:doctorId', authenticate, auditMiddleware('Inpatient'), getInpatientsByDoctor);
router.get('/appointment/:appointmentId', authenticate, auditMiddleware('Inpatient'), getInpatientsByAppointment);
router.put('/:id', authenticate, auditModificationMiddleware('Inpatient'), updateInpatient);
router.delete('/:id', authenticate, auditModificationMiddleware('Inpatient'), deleteInpatient);

export default router;
