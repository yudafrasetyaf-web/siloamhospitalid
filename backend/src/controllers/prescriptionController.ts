import { Request, Response } from 'express';
import Prescription from '../models/Prescription';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth';

export const createPrescription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId, patientId, doctorId, medication, dosage, frequency, duration, notes } = req.body;
  const prescription = await Prescription.create({ appointmentId, patientId, doctorId, medication, dosage, frequency, duration, notes });
  res.status(201).json({ success: true, data: { prescription } });
});

export const getPrescriptionById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const prescription = await Prescription.findByPk(id);
  if (!prescription) throw new AppError('Prescription not found', 404);
  res.json({ success: true, data: { prescription } });
});

export const getPrescriptionsByPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { patientId } = req.params;
  const prescriptions = await Prescription.findAll({ where: { patientId } });
  res.json({ success: true, data: { prescriptions } });
});

export const getPrescriptionsByDoctor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { doctorId } = req.params;
  const prescriptions = await Prescription.findAll({ where: { doctorId } });
  res.json({ success: true, data: { prescriptions } });
});

export const getPrescriptionsByAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId } = req.params;
  const prescriptions = await Prescription.findAll({ where: { appointmentId } });
  res.json({ success: true, data: { prescriptions } });
});

export const updatePrescription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const prescription = await Prescription.findByPk(id);
  if (!prescription) throw new AppError('Prescription not found', 404);
  await prescription.update(req.body);
  res.json({ success: true, data: { prescription } });
});

export const deletePrescription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const prescription = await Prescription.findByPk(id);
  if (!prescription) throw new AppError('Prescription not found', 404);
  await prescription.destroy();
  res.json({ success: true, message: 'Prescription deleted' });
});
