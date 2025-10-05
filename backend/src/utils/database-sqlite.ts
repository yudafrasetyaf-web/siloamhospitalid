import { Sequelize } from 'sequelize';
import path from 'path';
import logger from './logger';

// SQLite database - no installation required!
const sequelize = new Sequelize({
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
    logger.info('✅ SQLite Database connection established successfully');
    
    // Auto-sync database (create tables)
    await sequelize.sync({ alter: true });
    logger.info('✅ Database tables synchronized');
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
