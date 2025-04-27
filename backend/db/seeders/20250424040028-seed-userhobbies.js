'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('UserHobbies', [
      { userId: 1, hobbyId: 1, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, hobbyId: 2, createdAt: new Date(), updatedAt: new Date() },
      { userId: 3, hobbyId: 3, createdAt: new Date(), updatedAt: new Date() },
      { userId: 4, hobbyId: 4, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('UserHobbies');
  }
};
