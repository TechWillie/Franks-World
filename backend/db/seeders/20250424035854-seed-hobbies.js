'use strict';

let options = { tableName: "Hobbies" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(options, [
      { name: 'Music', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Photography', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gaming', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cooking', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete(options, null, {});
  }
};

