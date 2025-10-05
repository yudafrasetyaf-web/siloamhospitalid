/**
 * Database Migration: Add Multi-Factor Authentication Fields
 * 
 * ISO 27001 Compliance: A.9.4.1 - Access control
 * 
 * This migration adds MFA support to the users table:
 * - is_mfa_enabled: Boolean flag for MFA status
 * - mfa_secret: Encrypted TOTP secret
 * - mfa_recovery_codes: Array of encrypted backup codes
 * 
 * Date: 2025-10-04
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add MFA enabled flag
    await queryInterface.addColumn('users', 'is_mfa_enabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    // Add encrypted MFA secret
    await queryInterface.addColumn('users', 'mfa_secret', {
      type: Sequelize.STRING(512),
      allowNull: true,
    });

    // Add encrypted recovery codes
    await queryInterface.addColumn('users', 'mfa_recovery_codes', {
      type: Sequelize.ARRAY(Sequelize.STRING(512)),
      allowNull: true,
      defaultValue: [],
    });

    // Add index for faster MFA lookups
    await queryInterface.addIndex('users', ['is_mfa_enabled'], {
      name: 'users_mfa_enabled_idx',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index first
    await queryInterface.removeIndex('users', 'users_mfa_enabled_idx');

    // Remove columns
    await queryInterface.removeColumn('users', 'mfa_recovery_codes');
    await queryInterface.removeColumn('users', 'mfa_secret');
    await queryInterface.removeColumn('users', 'is_mfa_enabled');
  },
};
