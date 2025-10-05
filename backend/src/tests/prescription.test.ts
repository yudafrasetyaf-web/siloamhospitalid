import request from 'supertest';
import app from '../index';

describe('Prescription API', () => {
  let token: string;
  let prescriptionId: number;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'password' });
    token = res.body.data.token;
  });

  it('should create a prescription', async () => {
    const res = await request(app)
      .post('/api/v1/prescriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        appointmentId: 1,
        patientId: 1,
        doctorId: 1,
        medication: 'Paracetamol',
        dosage: '500mg',
        frequency: '3x sehari',
        duration: '5 hari',
        notes: 'Minum setelah makan'
      });
    expect(res.status).toBe(201);
    expect(res.body.data.prescription).toBeDefined();
    prescriptionId = res.body.data.prescription.id;
  });

  it('should get a prescription by id', async () => {
    const res = await request(app)
      .get(`/api/v1/prescriptions/${prescriptionId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.prescription).toBeDefined();
  });

  it('should update a prescription', async () => {
    const res = await request(app)
      .put(`/api/v1/prescriptions/${prescriptionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Diminum sebelum tidur' });
    expect(res.status).toBe(200);
    expect(res.body.data.prescription.notes).toBe('Diminum sebelum tidur');
  });

  it('should delete a prescription', async () => {
    const res = await request(app)
      .delete(`/api/v1/prescriptions/${prescriptionId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
