import request from 'supertest';
import app from '../index';
import { MedicalRecord } from '../models/MedicalRecord';

describe('MedicalRecord API', () => {
  let token: string;
  let recordId: number;

  beforeAll(async () => {
    // Login as test user (assume user exists)
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'password' });
    token = res.body.data.token;
  });

  it('should create a medical record', async () => {
    const res = await request(app)
      .post('/api/v1/medical-records')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patientId: 1,
        doctorId: 1,
        diagnosis: 'Test Diagnosis',
        treatment: 'Test Treatment',
        prescription: 'Test Prescription',
        notes: 'Test Notes'
      });
    expect(res.status).toBe(201);
    expect(res.body.data.record).toBeDefined();
    recordId = res.body.data.record.id;
  });

  it('should get a medical record by id', async () => {
    const res = await request(app)
      .get(`/api/v1/medical-records/${recordId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.record).toBeDefined();
  });

  it('should update a medical record', async () => {
    const res = await request(app)
      .put(`/api/v1/medical-records/${recordId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Updated Notes' });
    expect(res.status).toBe(200);
    expect(res.body.data.record.notes).toBe('Updated Notes');
  });

  it('should delete a medical record', async () => {
    const res = await request(app)
      .delete(`/api/v1/medical-records/${recordId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
