import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Appointment, { AppointmentStatus } from '../models/Appointment';
import Doctor from '../models/Doctor';
import User from '../models/User';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth';

export const createAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    doctorId,
    appointmentDate,
    appointmentTime,
    reasonForVisit,
    symptoms
  } = req.body;

  const patientId = req.user!.id;

  // Check if doctor exists
  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  // Check if slot is available
  const existingAppointment = await Appointment.findOne({
    where: {
      doctorId,
      appointmentDate,
      appointmentTime,
      status: {
        [Op.notIn]: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]
      }
    }
  });

  if (existingAppointment) {
    throw new AppError('This time slot is already booked', 400);
  }

  // Create appointment
  const appointment = await Appointment.create({
    patientId,
    doctorId,
    appointmentDate,
    appointmentTime,
    duration: 30,
    status: AppointmentStatus.PENDING,
    reasonForVisit,
    symptoms,
    amount: doctor.consultationFee,
    isPaid: false
  });

  res.status(201).json({
    success: true,
    data: { appointment }
  });
});

export const getMyAppointments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { status, upcoming } = req.query;

  const where: any = { patientId: userId };

  if (status) {
    where.status = status;
  }

  if (upcoming === 'true') {
    where.appointmentDate = {
      [Op.gte]: new Date()
    };
  }

  const appointments = await Appointment.findAll({
    where,
    include: [
      {
        model: Doctor,
        as: 'doctor',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'profileImage']
          }
        ]
      }
    ],
    order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']]
  });

  res.json({
    success: true,
    data: { appointments }
  });
});

export const getDoctorAppointments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { doctorId } = req.params;
  const { date, status } = req.query;

  const doctor = await Doctor.findOne({ where: { userId: req.user!.id } });
  if (!doctor) {
    throw new AppError('Doctor profile not found', 404);
  }

  const where: any = { doctorId: doctor.id };

  if (date) {
    where.appointmentDate = date;
  }

  if (status) {
    where.status = status;
  }

  const appointments = await Appointment.findAll({
    where,
    include: [
      {
        model: User,
        as: 'patient',
        attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email']
      }
    ],
    order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
  });

  res.json({
    success: true,
    data: { appointments }
  });
});

export const getAppointmentById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const appointment = await Appointment.findByPk(id, {
    include: [
      {
        model: User,
        as: 'patient',
        attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email']
      },
      {
        model: Doctor,
        as: 'doctor',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'profileImage']
          }
        ]
      }
    ]
  });

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  // Check authorization
  if (appointment.patientId !== req.user!.id && req.user!.role !== 'admin') {
    throw new AppError('Not authorized to view this appointment', 403);
  }

  res.json({
    success: true,
    data: { appointment }
  });
});

export const updateAppointmentStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes, cancelReason } = req.body;

  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  const updates: any = { status };
  if (notes) updates.notes = notes;
  if (cancelReason) updates.cancelReason = cancelReason;

  await appointment.update(updates);

  res.json({
    success: true,
    data: { appointment }
  });
});

export const cancelAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  // Check if user is the patient
  if (appointment.patientId !== req.user!.id) {
    throw new AppError('Not authorized to cancel this appointment', 403);
  }

  // Check if appointment can be cancelled
  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new AppError('Cannot cancel completed appointment', 400);
  }

  await appointment.update({
    status: AppointmentStatus.CANCELLED,
    cancelReason: reason
  });

  res.json({
    success: true,
    message: 'Appointment cancelled successfully'
  });
});
