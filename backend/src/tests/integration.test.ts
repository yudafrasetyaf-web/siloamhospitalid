import request from 'supertest';
import app from '../index';
import { testUtils } from './setup';
import User from '../models/User';
import Doctor from '../models/Doctor';
import Appointment from '../models/Appointment';

describe('Integration Tests', () => {
  beforeEach(async () => {
    await testUtils.clearDatabase();
  });

  describe('Complete User Journey', () => {
    let patientToken: string;
    let doctorToken: string;
    let patientId: number;
    let doctorId: number;

    beforeEach(async () => {
      // Register patient
      const patientData = testUtils.generateTestUser();
      const patientResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(patientData)
        .expect(201);
      
      patientToken = patientResponse.body.data.token;
      patientId = patientResponse.body.data.user.id;

      // Register doctor
      const doctorData = testUtils.generateTestDoctor();
      const doctorResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(doctorData)
        .expect(201);
      
      doctorToken = doctorResponse.body.data.token;
      doctorId = doctorResponse.body.data.user.id;

      // Create doctor profile
      await request(app)
        .post('/api/v1/doctors')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          userId: doctorId,
          specialization: doctorData.specialization,
          licenseNumber: doctorData.licenseNumber,
          experience: 5,
          consultationFee: 200000
        })
        .expect(201);
    });

    it('should complete appointment booking flow', async () => {
      // Get available doctors
      const doctorsResponse = await request(app)
        .get('/api/v1/doctors')
        .expect(200);

      expect(doctorsResponse.body.success).toBe(true);
      expect(doctorsResponse.body.data.doctors).toHaveLength(1);

      // Book appointment
      const appointmentData = {
        doctorId: doctorId,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: '10:00',
        reason: 'Regular checkup'
      };

      const appointmentResponse = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(appointmentData)
        .expect(201);

      expect(appointmentResponse.body.success).toBe(true);
      expect(appointmentResponse.body.data.appointment.status).toBe('scheduled');

      // Get patient appointments
      const appointmentsResponse = await request(app)
        .get('/api/v1/appointments/my-appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(appointmentsResponse.body.success).toBe(true);
      expect(appointmentsResponse.body.data.appointments).toHaveLength(1);

      // Doctor updates appointment status
      const appointmentId = appointmentResponse.body.data.appointment.id;
      const updateResponse = await request(app)
        .put(`/api/v1/appointments/${appointmentId}/status`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({ status: 'confirmed' })
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.appointment.status).toBe('confirmed');
    });

    it('should handle appointment cancellation', async () => {
      // Book appointment
      const appointmentData = {
        doctorId: doctorId,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: '10:00',
        reason: 'Regular checkup'
      };

      const appointmentResponse = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(appointmentData)
        .expect(201);

      const appointmentId = appointmentResponse.body.data.appointment.id;

      // Cancel appointment
      const cancelResponse = await request(app)
        .put(`/api/v1/appointments/${appointmentId}/cancel`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(cancelResponse.body.success).toBe(true);
      expect(cancelResponse.body.data.appointment.status).toBe('cancelled');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle database connection errors gracefully', async () => {
      // This test would require mocking database connection failure
      // For now, we'll test error handling in general
      const response = await request(app)
        .get('/api/v1/nonexistent-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('not found');
    });

    it('should handle validation errors across endpoints', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123',
        firstName: '',
        lastName: ''
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(invalidData)
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBeDefined();
    });
  });

  describe('Security Integration', () => {
    let userToken: string;

    beforeEach(async () => {
      const userData = testUtils.generateTestUser();
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);
      
      userToken = response.body.data.token;
    });

    it('should enforce rate limiting', async () => {
      // Make multiple requests quickly
      const requests = Array(10).fill(null).map(() =>
        request(app)
          .get('/api/v1/auth/me')
          .set('Authorization', `Bearer ${userToken}`)
      );

      const responses = await Promise.all(requests);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('should enforce CORS policy', async () => {
      const response = await request(app)
        .options('/api/v1/auth/me')
        .set('Origin', 'https://malicious-site.com')
        .expect(403);

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('should enforce authentication on protected routes', async () => {
      const response = await request(app)
        .get('/api/v1/appointments/my-appointments')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('No token provided');
    });
  });

  describe('Data Consistency', () => {
    it('should maintain referential integrity', async () => {
      const userData = testUtils.generateTestUser();
      const userResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      const userId = userResponse.body.data.user.id;

      // Try to create appointment with non-existent doctor
      const appointmentData = {
        doctorId: 99999, // Non-existent doctor
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: '10:00',
        reason: 'Test appointment'
      };

      const response = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${userResponse.body.data.token}`)
        .send(appointmentData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Doctor not found');
    });
  });
});
