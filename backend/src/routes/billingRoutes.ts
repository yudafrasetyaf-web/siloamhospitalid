import { Router } from 'express';
import {
  createBilling,
  getBillingById,
  getBillingsByPatient,
  getBillingsByAppointment,
  updateBilling,
  deleteBilling
} from '../controllers/billingController';
import { authenticate } from '../middlewares/auth';
import { auditMiddleware, auditModificationMiddleware } from '../middlewares/auditLogger';

const router = Router();

router.post('/', authenticate, auditModificationMiddleware('Billing'), createBilling);
router.get('/:id', authenticate, auditMiddleware('Billing'), getBillingById);
router.get('/patient/:patientId', authenticate, auditMiddleware('Billing'), getBillingsByPatient);
router.get('/appointment/:appointmentId', authenticate, auditMiddleware('Billing'), getBillingsByAppointment);
router.put('/:id', authenticate, auditModificationMiddleware('Billing'), updateBilling);
router.delete('/:id', authenticate, auditModificationMiddleware('Billing'), deleteBilling);

export default router;
