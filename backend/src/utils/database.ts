import { Sequelize } from 'sequelize';
import path from 'path';
import logger from './logger';
import dotenv from 'dotenv';

// Ensure env vars are loaded even if this file is imported before index.ts
dotenv.config();

// Choose database based on environment
// If DB_DIALECT=postgres (and DB_HOST is provided), use Postgres. Otherwise default to SQLite.
const usePostgres =
  (process.env.DB_DIALECT?.toLowerCase() === 'postgres' || process.env.DB_DIALECT?.toLowerCase() === 'postgresql') &&
  !!process.env.DB_HOST;

const sequelize = usePostgres
  ? new Sequelize(
      process.env.DB_NAME || 'hospital_db',
      process.env.DB_USER || 'hospital_admin',
      process.env.DB_PASSWORD || 'secure_password_123',
      {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        logging: (msg) => logger.debug(msg),
        // Connection pooling for performance and reliability
        pool: {
          max: parseInt(process.env.DB_POOL_MAX || '10', 10),
          min: parseInt(process.env.DB_POOL_MIN || '2', 10),
          acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
          idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10)
        },
        define: {
          timestamps: true,
          underscored: true,
          freezeTableName: true
        },
        // Retry connection on failure
        retry: {
          max: 3
        }
      }
    )
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../database.sqlite'),
      logging: (msg) => logger.debug(msg),
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    });

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info(`✅ Database connection established successfully (dialect: ${usePostgres ? 'postgres' : 'sqlite'})`);
    
    // Auto-sync database (create tables)
    // Use alter: false to avoid SQLite index/constraint recreation issues
    await sequelize.sync({ alter: false });
    logger.info('✅ Database tables synchronized');
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
