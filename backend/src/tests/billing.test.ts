import request from 'supertest';
import app from '../index';

describe('Billing API', () => {
  let token: string;
  let billingId: number;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'password' });
    token = res.body.data.token;
  });

  it('should create a billing', async () => {
    const res = await request(app)
      .post('/api/v1/billings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        appointmentId: 1,
        patientId: 1,
        amount: 100000,
        status: 'unpaid'
      });
    expect(res.status).toBe(201);
    expect(res.body.data.billing).toBeDefined();
    billingId = res.body.data.billing.id;
  });

  it('should get a billing by id', async () => {
    const res = await request(app)
      .get(`/api/v1/billings/${billingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.billing).toBeDefined();
  });

  it('should update a billing', async () => {
    const res = await request(app)
      .put(`/api/v1/billings/${billingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'paid' });
    expect(res.status).toBe(200);
    expect(res.body.data.billing.status).toBe('paid');
  });

  it('should delete a billing', async () => {
    const res = await request(app)
      .delete(`/api/v1/billings/${billingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
