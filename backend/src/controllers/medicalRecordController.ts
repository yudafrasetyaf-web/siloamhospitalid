import { Request, Response } from 'express';
import MedicalRecord from '../models/MedicalRecord';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth';

export const createMedicalRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { patientId, doctorId, appointmentId, diagnosis, treatment, prescription, notes } = req.body;
  const record = await MedicalRecord.create({ patientId, doctorId, appointmentId, diagnosis, treatment, prescription, notes });
  res.status(201).json({ success: true, data: { record } });
});

export const getMedicalRecordById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const record = await MedicalRecord.findByPk(id);
  if (!record) throw new AppError('Medical record not found', 404);
  res.json({ success: true, data: { record } });
});

export const getMedicalRecordsByPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { patientId } = req.params;
  const records = await MedicalRecord.findAll({ where: { patientId } });
  res.json({ success: true, data: { records } });
});

export const getMedicalRecordsByDoctor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { doctorId } = req.params;
  const records = await MedicalRecord.findAll({ where: { doctorId } });
  res.json({ success: true, data: { records } });
});

export const updateMedicalRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const record = await MedicalRecord.findByPk(id);
  if (!record) throw new AppError('Medical record not found', 404);
  await record.update(req.body);
  res.json({ success: true, data: { record } });
});

export const deleteMedicalRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const record = await MedicalRecord.findByPk(id);
  if (!record) throw new AppError('Medical record not found', 404);
  await record.destroy();
  res.json({ success: true, message: 'Medical record deleted' });
});
