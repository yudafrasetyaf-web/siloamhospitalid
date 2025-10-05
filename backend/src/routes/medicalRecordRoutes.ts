import { Router } from 'express';
import {
  createMedicalRecord,
  getMedicalRecordById,
  getMedicalRecordsByPatient,
  getMedicalRecordsByDoctor,
  updateMedicalRecord,
  deleteMedicalRecord
} from '../controllers/medicalRecordController';
import { authenticate } from '../middlewares/auth';
import { auditMiddleware, auditModificationMiddleware } from '../middlewares/auditLogger';

const router = Router();

router.post('/', authenticate, auditModificationMiddleware('MedicalRecord'), createMedicalRecord);
router.get('/:id', authenticate, auditMiddleware('MedicalRecord'), getMedicalRecordById);
router.get('/patient/:patientId', authenticate, auditMiddleware('MedicalRecord'), getMedicalRecordsByPatient);
router.get('/doctor/:doctorId', authenticate, auditMiddleware('MedicalRecord'), getMedicalRecordsByDoctor);
router.put('/:id', authenticate, auditModificationMiddleware('MedicalRecord'), updateMedicalRecord);
router.delete('/:id', authenticate, auditModificationMiddleware('MedicalRecord'), deleteMedicalRecord);

export default router;
