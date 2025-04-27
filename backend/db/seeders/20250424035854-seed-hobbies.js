'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Hobbies', [
      { id: 1, name: 'Music', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Photography', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Gaming', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Cooking', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Hobbies');
  }
};

