import { Request, Response } from 'express';
import Specialization from '../models/Specialization';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import logger from '../utils/logger';

/**
 * @desc    Get all specializations/medical services
 * @route   GET /api/v1/specializations
 * @access  Public
 */
export const getSpecializations = asyncHandler(async (req: Request, res: Response) => {
  const specializations = await Specialization.findAll({
    order: [['name', 'ASC']]
  });

  res.json({
    success: true,
    count: specializations.length,
    data: specializations
  });
});

/**
 * @desc    Get single specialization by ID
 * @route   GET /api/v1/specializations/:id
 * @access  Public
 */
export const getSpecialization = asyncHandler(async (req: Request, res: Response) => {
  const specialization = await Specialization.findByPk(req.params.id);

  if (!specialization) {
    throw new AppError('Specialization not found', 404);
  }

  res.json({
    success: true,
    data: specialization
  });
});

/**
 * @desc    Create new specialization
 * @route   POST /api/v1/specializations
 * @access  Private/Admin
 */
export const createSpecialization = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  // Check if specialization already exists
  const existing = await Specialization.findOne({ where: { name } });
  if (existing) {
    throw new AppError('Specialization with this name already exists', 400);
  }

  const specialization = await Specialization.create({ name, description });

  logger.info(`New specialization created: ${name}`);

  res.status(201).json({
    success: true,
    data: specialization
  });
});

/**
 * @desc    Update specialization
 * @route   PUT /api/v1/specializations/:id
 * @access  Private/Admin
 */
export const updateSpecialization = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const specialization = await Specialization.findByPk(req.params.id);

  if (!specialization) {
    throw new AppError('Specialization not found', 404);
  }

  await specialization.update({ name, description });

  logger.info(`Specialization updated: ${specialization.name}`);

  res.json({
    success: true,
    data: specialization
  });
});

/**
 * @desc    Delete specialization
 * @route   DELETE /api/v1/specializations/:id
 * @access  Private/Admin
 */
export const deleteSpecialization = asyncHandler(async (req: Request, res: Response) => {
  const specialization = await Specialization.findByPk(req.params.id);

  if (!specialization) {
    throw new AppError('Specialization not found', 404);
  }

  await specialization.destroy();

  logger.info(`Specialization deleted: ${specialization.name}`);

  res.json({
    success: true,
    message: 'Specialization deleted successfully'
  });
});
