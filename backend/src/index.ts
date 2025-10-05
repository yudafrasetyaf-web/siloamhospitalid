import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from './utils/database';
import { connectRedis, getRedisClient } from './utils/redis';
import sequelize from './utils/database';
import logger from './utils/logger';
import { errorHandler, notFound } from './middlewares/errorHandler';
import { prometheusMiddleware, prometheusMetricsRoute } from './middlewares/monitoring';
import { auditLogger } from './middlewares/advancedAuditLogger';

// Import models (to ensure they are registered with Sequelize)
import './models/User';
import './models/Doctor';
import './models/Appointment';
import './models/Hospital';
import './models/MedicalRecord';
import './models/Billing';
import './models/LabResult';
import './models/Inpatient';
import './models/Specialization';

// Import routes
import mfaRoutes from './routes/mfaRoutes';
import specializationRoutes from './routes/specializationRoutes';
import contentRoutes from './routes/contentRoutes';
import doctorRoutes from './routes/doctorRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import hospitalRoutes from './routes/hospitalRoutes';
import medicalRecordRoutes from './routes/medicalRecordRoutes';
import billingRoutes from './routes/billingRoutes';
import integrationRoutes from './routes/integrationRoutes';

// Prometheus metrics endpoint
app.get('/metrics', prometheusMetricsRoute);

// API Routes
app.use(`/api/${API_VERSION}/mfa`, mfaRoutes);
app.use(`/api/${API_VERSION}/specializations`, specializationRoutes);
app.use(`/api/${API_VERSION}/content`, contentRoutes);
app.use(`/api/${API_VERSION}/doctors`, doctorRoutes);
app.use(`/api/${API_VERSION}/appointments`, appointmentRoutes);
app.use(`/api/${API_VERSION}/hospitals`, hospitalRoutes);
app.use(`/api/${API_VERSION}/medical-records`, medicalRecordRoutes);
app.use(`/api/${API_VERSION}/billings`, billingRoutes);
app.use(`/api/${API_VERSION}/lab-results`, labResultRoutes);
app.use(`/api/${API_VERSION}/inpatients`, inpatientRoutes);
app.use(`/api/${API_VERSION}/integrations`, integrationRoutes);

// API documentation endpoint
app.get(`/api/${API_VERSION}`, (req, res) => {
  res.json({
    success: true,
    message: 'Siloam Hospital Management System API',
    version: API_VERSION,
    endpoints: {
      auth: {
        register: 'POST /api/v1/auth/register',
        login: 'POST /api/v1/auth/login',
        profile: 'GET /api/v1/auth/me',
        updateProfile: 'PUT /api/v1/auth/profile',
        changePassword: 'PUT /api/v1/auth/change-password'
      },
      doctors: {
        list: 'GET /api/v1/doctors',
        details: 'GET /api/v1/doctors/:id',
        specializations: 'GET /api/v1/doctors/specializations',
        create: 'POST /api/v1/doctors (Admin)',
        update: 'PUT /api/v1/doctors/:id (Admin/Doctor)',
        delete: 'DELETE /api/v1/doctors/:id (Admin)'
      },
      appointments: {
        create: 'POST /api/v1/appointments',
        myAppointments: 'GET /api/v1/appointments/my-appointments',
        details: 'GET /api/v1/appointments/:id',
        updateStatus: 'PUT /api/v1/appointments/:id/status (Doctor/Admin)',
        cancel: 'PUT /api/v1/appointments/:id/cancel'
      },
      hospitals: {
        list: 'GET /api/v1/hospitals',
        details: 'GET /api/v1/hospitals/:id',
        create: 'POST /api/v1/hospitals (Admin)',
        update: 'PUT /api/v1/hospitals/:id (Admin)',
        delete: 'DELETE /api/v1/hospitals/:id (Admin)'
      }
    }
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Connect to Redis (optional)
    connectRedis();

    // Start listening
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API URL: http://localhost:${PORT}/api/${API_VERSION}`);
      logger.info(`💚 Health check: http://localhost:${PORT}/health`);
      logger.info(`📊 Metrics: http://localhost:${PORT}/metrics`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;
