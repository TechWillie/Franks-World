'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Users',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        firstName: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        username: {
          type: Sequelize.STRING(50),
          unique: true,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(100),
          unique: true,
          allowNull: false,
        },
        hashedPassword: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        bio: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        photo: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.dropTable(options);
  },
};
