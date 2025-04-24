'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPasswords = await Promise.all([
      bcrypt.hash('password', 10),
      bcrypt.hash('password', 10),
      bcrypt.hash('password', 10),
      bcrypt.hash('password', 10)
    ]);

    await queryInterface.bulkInsert('Users', [
      {
        username: 'alice',
        email: 'alice@example.com',
        hashedPassword: hashedPasswords[0],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'bobby',
        email: 'bobby@example.com',
        hashedPassword: hashedPasswords[1],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'carol',
        email: 'carol@example.com',
        hashedPassword: hashedPasswords[2],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'dave',
        email: 'dave@example.com',
        hashedPassword: hashedPasswords[3],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
