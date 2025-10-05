import { Request, Response } from 'express';
import Billing from '../models/Billing';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth';

export const createBilling = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId, patientId, amount, status, paymentMethod, paymentDate, notes } = req.body;
  const billing = await Billing.create({ appointmentId, patientId, amount, status, paymentMethod, paymentDate, notes });
  res.status(201).json({ success: true, data: { billing } });
});

export const getBillingById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const billing = await Billing.findByPk(id);
  if (!billing) throw new AppError('Billing not found', 404);
  res.json({ success: true, data: { billing } });
});

export const getBillingsByPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { patientId } = req.params;
  const billings = await Billing.findAll({ where: { patientId } });
  res.json({ success: true, data: { billings } });
});

export const getBillingsByAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId } = req.params;
  const billing = await Billing.findOne({ where: { appointmentId } });
  if (!billing) throw new AppError('Billing not found', 404);
  res.json({ success: true, data: { billing } });
});

export const updateBilling = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const billing = await Billing.findByPk(id);
  if (!billing) throw new AppError('Billing not found', 404);
  await billing.update(req.body);
  res.json({ success: true, data: { billing } });
});

export const deleteBilling = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const billing = await Billing.findByPk(id);
  if (!billing) throw new AppError('Billing not found', 404);
  await billing.destroy();
  res.json({ success: true, message: 'Billing deleted' });
});
