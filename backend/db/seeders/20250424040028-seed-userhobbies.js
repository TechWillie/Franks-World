'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('User_Hobbies', [
      { user_Id: 1, hobby_Id: 1, createdAt: new Date(), updatedAt: new Date() },
      { user_Id: 2, hobby_Id: 2, createdAt: new Date(), updatedAt: new Date() },
      { user_Id: 3, hobby_Id: 3, createdAt: new Date(), updatedAt: new Date() },
      { user_Id: 4, hobby_Id: 4, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('User_Hobbies');
  }
};
