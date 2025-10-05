import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import path from 'path';

// Load test environment variables
config({ path: path.join(__dirname, '../../.env.test') });

// Test database configuration
const testConfig = {
  database: process.env.TEST_DB_NAME || 'hospital_test_db',
  username: process.env.TEST_DB_USER || 'test_user',
  password: process.env.TEST_DB_PASSWORD || 'test_password',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  dialect: 'postgres' as const,
  logging: false, // Disable logging in tests
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Create test database connection
export const testSequelize = new Sequelize(testConfig);

// Test utilities
export const testUtils = {
  async clearDatabase() {
    await testSequelize.sync({ force: true });
  },

  async closeConnection() {
    await testSequelize.close();
  },

  generateTestUser() {
    return {
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'patient' as const,
      isActive: true
    };
  },

  generateTestDoctor() {
    return {
      email: `doctor${Date.now()}@example.com`,
      password: 'DoctorPassword123!',
      firstName: 'Test',
      lastName: 'Doctor',
      role: 'doctor' as const,
      specialization: 'Cardiology',
      licenseNumber: `LIC${Date.now()}`,
      isActive: true
    };
  },

  generateTestAppointment() {
    return {
      patientId: 1,
      doctorId: 1,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      appointmentTime: '10:00',
      reason: 'Test appointment',
      status: 'scheduled' as const
    };
  }
};

// Global test setup
beforeAll(async () => {
  await testSequelize.authenticate();
  await testSequelize.sync({ force: true });
});

// Global test teardown
afterAll(async () => {
  await testSequelize.close();
});

// Clean up after each test
afterEach(async () => {
  await testUtils.clearDatabase();
});
