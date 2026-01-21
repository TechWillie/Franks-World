'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */

let options = { tableName: "Users" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

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
        // id: 1,
        username: 'alice',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        hashedPassword: hashedPasswords[0],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // id: 2,
        username: 'bobby',
        firstName: 'Bobbyish',
        lastName: 'Brownie',
        email: 'bobby@example.com',
        hashedPassword: hashedPasswords[1],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // id: 3,
        username: 'carol',
        firstName: 'Diddy',
        lastName: 'Didit',
        email: 'carol@example.com',
        hashedPassword: hashedPasswords[2],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // id: 4,
        username: 'dave',
        firstName: 'Dave',
        lastName: 'Busters',
        email: 'dave@example.com',
        hashedPassword: hashedPasswords[3],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
