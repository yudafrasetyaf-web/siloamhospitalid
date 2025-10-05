/**
 * Database Migration: Add Security Fields to Users Table
 * 
 * ISO 27001 Compliance:
 * - Account lockout mechanism (A.9.4.2)
 * - Password history tracking (A.9.4.3)
 * - Password aging policy (A.9.4.3)
 * 
 * Date: 2025-10-04
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add security columns to users table
    await queryInterface.addColumn('users', 'login_attempts', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });

    await queryInterface.addColumn('users', 'lock_until', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'password_changed_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'password_history', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: [],
    });

    // Add index for performance on lockout checks
    await queryInterface.addIndex('users', ['lock_until'], {
      name: 'users_lock_until_idx',
    });

    // Add index for password expiry checks
    await queryInterface.addIndex('users', ['password_changed_at'], {
      name: 'users_password_changed_at_idx',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('users', 'users_lock_until_idx');
    await queryInterface.removeIndex('users', 'users_password_changed_at_idx');

    // Remove columns
    await queryInterface.removeColumn('users', 'login_attempts');
    await queryInterface.removeColumn('users', 'lock_until');
    await queryInterface.removeColumn('users', 'password_changed_at');
    await queryInterface.removeColumn('users', 'password_history');
  },
};
