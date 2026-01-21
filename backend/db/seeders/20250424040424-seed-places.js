'use strict';

let options = { tableName: 'Places' };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}


module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(options, [
      { name: 'Central Park', location: 'NYC', createdAt: new Date(), updatedAt: new Date(), description: 'A large public park in the heart of Manhattan.' },
      { name: 'Golden Gate Park', location: 'San Francisco', createdAt: new Date(), updatedAt: new Date(), description: 'A large urban park in San Francisco.' },
      { name: 'Millennium Park', location: 'Chicago', createdAt: new Date(), updatedAt: new Date(), description: 'A large public park in the heart of Chicago.' },
      { name: 'Balboa Park', location: 'San Diego', createdAt: new Date(), updatedAt: new Date(), description: 'A large urban park in San Diego.' }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
