'use strict';

let options = { tableName: 'Places' };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}


module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(options, [
      { id: 1, name: 'Central Park', location: 'NYC', createdAt: new Date(), updatedAt: new Date(), description: 'A large public park in the heart of Manhattan.' },
      { id: 2, name: 'Golden Gate Park', location: 'San Francisco', createdAt: new Date(), updatedAt: new Date(), description: 'A large urban park in San Francisco.' },
      { id: 3, name: 'Millennium Park', location: 'Chicago', createdAt: new Date(), updatedAt: new Date(), description: 'A large public park in the heart of Chicago.' },
      { id: 4, name: 'Balboa Park', location: 'San Diego', createdAt: new Date(), updatedAt: new Date(), description: 'A large urban park in San Diego.' }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
