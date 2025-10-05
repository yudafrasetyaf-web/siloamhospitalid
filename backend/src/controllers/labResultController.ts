import { Request, Response } from 'express';
import LabResult from '../models/LabResult';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth';

export const createLabResult = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId, patientId, doctorId, testName, result, unit, referenceRange, notes } = req.body;
  const labResult = await LabResult.create({ appointmentId, patientId, doctorId, testName, result, unit, referenceRange, notes });
  res.status(201).json({ success: true, data: { labResult } });
});

export const getLabResultById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const labResult = await LabResult.findByPk(id);
  if (!labResult) throw new AppError('Lab result not found', 404);
  res.json({ success: true, data: { labResult } });
});

export const getLabResultsByPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { patientId } = req.params;
  const labResults = await LabResult.findAll({ where: { patientId } });
  res.json({ success: true, data: { labResults } });
});

export const getLabResultsByDoctor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { doctorId } = req.params;
  const labResults = await LabResult.findAll({ where: { doctorId } });
  res.json({ success: true, data: { labResults } });
});

export const getLabResultsByAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId } = req.params;
  const labResults = await LabResult.findAll({ where: { appointmentId } });
  res.json({ success: true, data: { labResults } });
});

export const updateLabResult = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const labResult = await LabResult.findByPk(id);
  if (!labResult) throw new AppError('Lab result not found', 404);
  await labResult.update(req.body);
  res.json({ success: true, data: { labResult } });
});

export const deleteLabResult = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const labResult = await LabResult.findByPk(id);
  if (!labResult) throw new AppError('Lab result not found', 404);
  await labResult.destroy();
  res.json({ success: true, message: 'Lab result deleted' });
});
