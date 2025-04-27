'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Hobbies', [
      { name: 'Music', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Photography', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gaming', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cooking', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Hobbies');
  }
};

