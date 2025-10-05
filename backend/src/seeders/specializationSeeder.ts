import Specialization from '../models/Specialization';
import logger from '../utils/logger';

/**
 * Seeder for Medical Specializations
 * Initializes the 5 core medical services for Siloam Hospital
 */

const specializations = [
  {
    name: 'Emergency Care',
    description: 'Comprehensive 24/7 emergency medical services including trauma care, cardiac emergencies, and critical care. Our emergency department is equipped with state-of-the-art facilities and staffed by experienced emergency physicians.'
  },
  {
    name: 'Surgery',
    description: 'Advanced surgical services including general surgery, minimally invasive procedures, laparoscopic surgery, and robotic-assisted surgery. Our surgical team specializes in various procedures with high success rates.'
  },
  {
    name: 'Maternity',
    description: 'Complete maternity care including prenatal care, labor and delivery, postnatal care, and neonatal services. We provide a safe and comfortable environment for mothers and newborns with advanced NICU facilities.'
  },
  {
    name: 'Cardiology',
    description: 'Comprehensive cardiovascular care including diagnostic testing, interventional cardiology, cardiac surgery, and cardiac rehabilitation. Our cardiology center is equipped with cutting-edge technology for heart disease treatment.'
  },
  {
    name: 'Oncology',
    description: 'Complete cancer care services including medical oncology, radiation therapy, chemotherapy, and supportive care. Our multidisciplinary team provides personalized treatment plans using the latest cancer treatment technologies.'
  }
];

export const seedSpecializations = async (): Promise<void> => {
  try {
    logger.info('🌱 Starting specializations seeder...');

    // Check if specializations already exist
    const existingCount = await Specialization.count();
    
    if (existingCount > 0) {
      logger.info(`✅ Specializations already seeded (${existingCount} found). Skipping...`);
      return;
    }

    // Bulk insert specializations
    await Specialization.bulkCreate(specializations);

    logger.info(`✅ Successfully seeded ${specializations.length} specializations:`);
    specializations.forEach((spec, index) => {
      logger.info(`   ${index + 1}. ${spec.name}`);
    });

  } catch (error) {
    logger.error('❌ Error seeding specializations:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  const { connectDatabase } = require('../utils/database');
  
  connectDatabase()
    .then(() => seedSpecializations())
    .then(() => {
      logger.info('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedSpecializations;
