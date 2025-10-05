import request from 'supertest';
import app from '../index';

describe('Inpatient API', () => {
  let token: string;
  let inpatientId: number;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'password' });
    token = res.body.data.token;
  });

  it('should create an inpatient', async () => {
    const res = await request(app)
      .post('/api/v1/inpatients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        appointmentId: 1,
        patientId: 1,
        doctorId: 1,
        roomNumber: 'A101',
        admissionDate: new Date().toISOString(),
        status: 'admitted',
        notes: 'Pasien baru masuk'
      });
    expect(res.status).toBe(201);
    expect(res.body.data.inpatient).toBeDefined();
    inpatientId = res.body.data.inpatient.id;
  });

  it('should get an inpatient by id', async () => {
    const res = await request(app)
      .get(`/api/v1/inpatients/${inpatientId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.inpatient).toBeDefined();
  });

  it('should update an inpatient', async () => {
    const res = await request(app)
      .put(`/api/v1/inpatients/${inpatientId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Sudah dipindah ke ruang B202' });
    expect(res.status).toBe(200);
    expect(res.body.data.inpatient.notes).toBe('Sudah dipindah ke ruang B202');
  });

  it('should delete an inpatient', async () => {
    const res = await request(app)
      .delete(`/api/v1/inpatients/${inpatientId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
