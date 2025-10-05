import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Doctor from '../models/Doctor';
import User from '../models/User';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth';

export const getAllDoctors = asyncHandler(async (req: Request, res: Response) => {
  const {
    specialization,
    hospital,
    search,
    minRating,
    sortBy = 'rating',
    order = 'DESC',
    page = 1,
    limit = 12
  } = req.query;

  const where: any = { isAvailable: true };
  const userWhere: any = { isActive: true };

  // Filters
  if (specialization) {
    where.specialization = specialization;
  }

  if (hospital) {
    where.hospitalId = hospital;
  }

  if (minRating) {
    where.rating = { [Op.gte]: parseFloat(minRating as string) };
  }

  if (search) {
    userWhere[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows: doctors } = await Doctor.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        where: userWhere,
        attributes: ['id', 'firstName', 'lastName', 'profileImage', 'email']
      }
    ],
    order: [[sortBy as string, order as string]],
    limit: Number(limit),
    offset
  });

  res.json({
    success: true,
    data: {
      doctors,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        limit: Number(limit)
      }
    }
  });
});

export const getDoctorById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const doctor = await Doctor.findByPk(id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'profileImage', 'email', 'phoneNumber']
      }
    ]
  });

  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  res.json({
    success: true,
    data: { doctor }
  });
});

export const getSpecializations = asyncHandler(async (req: Request, res: Response) => {
  const specializations = await Doctor.findAll({
    attributes: ['specialization', 'subSpecialization'],
    group: ['specialization', 'subSpecialization'],
    raw: true
  });

  // Group by specialization
  const grouped = specializations.reduce((acc: any, curr: any) => {
    if (!acc[curr.specialization]) {
      acc[curr.specialization] = [];
    }
    if (curr.subSpecialization) {
      acc[curr.specialization].push(curr.subSpecialization);
    }
    return acc;
  }, {});

  res.json({
    success: true,
    data: { specializations: grouped }
  });
});

export const createDoctor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    userId,
    specialization,
    subSpecialization,
    licenseNumber,
    yearsOfExperience,
    education,
    hospitalId,
    consultationFee,
    bio,
    languages,
    availableDays
  } = req.body;

  // Check if user exists and is not already a doctor
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const existingDoctor = await Doctor.findOne({ where: { userId } });
  if (existingDoctor) {
    throw new AppError('User is already registered as a doctor', 400);
  }

  // Update user role to doctor
  await user.update({ role: 'doctor' });

  // Create doctor profile
  const doctor = await Doctor.create({
    userId,
    specialization,
    subSpecialization,
    licenseNumber,
    yearsOfExperience,
    education,
    hospitalId,
    consultationFee,
    bio,
    languages,
    availableDays
  });

  res.status(201).json({
    success: true,
    data: { doctor }
  });
});

export const updateDoctor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const doctor = await Doctor.findByPk(id);
  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  await doctor.update(updates);

  res.json({
    success: true,
    data: { doctor }
  });
});

export const deleteDoctor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const doctor = await Doctor.findByPk(id);
  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  await doctor.update({ isAvailable: false });

  res.json({
    success: true,
    message: 'Doctor deactivated successfully'
  });
});
