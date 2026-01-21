'use strict';

let options = { tableName: "Hobbies" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(options, [
      { id: 1, name: 'Music', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Photography', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Gaming', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Cooking', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete(options, null, {});
  }
};

