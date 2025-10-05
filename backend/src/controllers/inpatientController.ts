import { Request, Response } from 'express';
import Inpatient from '../models/Inpatient';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth';

export const createInpatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId, patientId, doctorId, roomNumber, admissionDate, dischargeDate, status, notes } = req.body;
  const inpatient = await Inpatient.create({ appointmentId, patientId, doctorId, roomNumber, admissionDate, dischargeDate, status, notes });
  res.status(201).json({ success: true, data: { inpatient } });
});

export const getInpatientById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const inpatient = await Inpatient.findByPk(id);
  if (!inpatient) throw new AppError('Inpatient not found', 404);
  res.json({ success: true, data: { inpatient } });
});

export const getInpatientsByPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { patientId } = req.params;
  const inpatients = await Inpatient.findAll({ where: { patientId } });
  res.json({ success: true, data: { inpatients } });
});

export const getInpatientsByDoctor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { doctorId } = req.params;
  const inpatients = await Inpatient.findAll({ where: { doctorId } });
  res.json({ success: true, data: { inpatients } });
});

export const getInpatientsByAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId } = req.params;
  const inpatient = await Inpatient.findOne({ where: { appointmentId } });
  if (!inpatient) throw new AppError('Inpatient not found', 404);
  res.json({ success: true, data: { inpatient } });
});

export const updateInpatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const inpatient = await Inpatient.findByPk(id);
  if (!inpatient) throw new AppError('Inpatient not found', 404);
  await inpatient.update(req.body);
  res.json({ success: true, data: { inpatient } });
});

export const deleteInpatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const inpatient = await Inpatient.findByPk(id);
  if (!inpatient) throw new AppError('Inpatient not found', 404);
  await inpatient.destroy();
  res.json({ success: true, message: 'Inpatient deleted' });
});
