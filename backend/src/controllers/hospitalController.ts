import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Hospital from '../models/Hospital';
import { AppError, asyncHandler } from '../middlewares/errorHandler';

export const getAllHospitals = asyncHandler(async (req: Request, res: Response) => {
  const { city, search, page = 1, limit = 10 } = req.query;

  const where: any = { isActive: true };

  if (city) {
    where.city = city;
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { city: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows: hospitals } = await Hospital.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [['name', 'ASC']]
  });

  res.json({
    success: true,
    data: {
      hospitals,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit))
      }
    }
  });
});

export const getHospitalById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const hospital = await Hospital.findByPk(id);
  if (!hospital) {
    throw new AppError('Hospital not found', 404);
  }

  res.json({
    success: true,
    data: { hospital }
  });
});

export const createHospital = asyncHandler(async (req: Request, res: Response) => {
  const hospital = await Hospital.create(req.body);

  res.status(201).json({
    success: true,
    data: { hospital }
  });
});

export const updateHospital = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const hospital = await Hospital.findByPk(id);
  if (!hospital) {
    throw new AppError('Hospital not found', 404);
  }

  await hospital.update(req.body);

  res.json({
    success: true,
    data: { hospital }
  });
});

export const deleteHospital = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const hospital = await Hospital.findByPk(id);
  if (!hospital) {
    throw new AppError('Hospital not found', 404);
  }

  await hospital.update({ isActive: false });

  res.json({
    success: true,
    message: 'Hospital deactivated successfully'
  });
});
