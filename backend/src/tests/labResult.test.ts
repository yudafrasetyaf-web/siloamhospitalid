import request from 'supertest';
import app from '../index';

describe('LabResult API', () => {
  let token: string;
  let labResultId: number;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'password' });
    token = res.body.data.token;
  });

  it('should create a lab result', async () => {
    const res = await request(app)
      .post('/api/v1/lab-results')
      .set('Authorization', `Bearer ${token}`)
      .send({
        appointmentId: 1,
        patientId: 1,
        doctorId: 1,
        testName: 'Hemoglobin',
        result: '13.5',
        unit: 'g/dL',
        referenceRange: '12-16',
        notes: 'Normal'
      });
    expect(res.status).toBe(201);
    expect(res.body.data.labResult).toBeDefined();
    labResultId = res.body.data.labResult.id;
  });

  it('should get a lab result by id', async () => {
    const res = await request(app)
      .get(`/api/v1/lab-results/${labResultId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.labResult).toBeDefined();
  });

  it('should update a lab result', async () => {
    const res = await request(app)
      .put(`/api/v1/lab-results/${labResultId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Sedikit di bawah normal' });
    expect(res.status).toBe(200);
    expect(res.body.data.labResult.notes).toBe('Sedikit di bawah normal');
  });

  it('should delete a lab result', async () => {
    const res = await request(app)
      .delete(`/api/v1/lab-results/${labResultId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
