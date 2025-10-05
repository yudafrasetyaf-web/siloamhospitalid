/**
 * Database Migration: Create Specializations Table
 * 
 * This migration creates:
 * 1. specializations table - Stores medical services (Emergency, Surgery, Maternity, Cardiology, Oncology)
 * 2. doctor_specializations table - Junction table for many-to-many relationship
 * 
 * Date: 2025-10-04
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create specializations table
    await queryInterface.createTable('specializations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create junction table for doctor-specialization relationship
    await queryInterface.createTable('doctor_specializations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'doctors',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      specialization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'specializations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add index for faster lookups
    await queryInterface.addIndex('doctor_specializations', ['doctor_id']);
    await queryInterface.addIndex('doctor_specializations', ['specialization_id']);
    
    // Unique constraint: each doctor can only have each specialization once
    await queryInterface.addIndex('doctor_specializations', ['doctor_id', 'specialization_id'], {
      unique: true,
      name: 'doctor_specialization_unique',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('doctor_specializations', 'doctor_specialization_unique');
    await queryInterface.removeIndex('doctor_specializations', ['specialization_id']);
    await queryInterface.removeIndex('doctor_specializations', ['doctor_id']);
    
    // Drop tables
    await queryInterface.dropTable('doctor_specializations');
    await queryInterface.dropTable('specializations');
  },
};
