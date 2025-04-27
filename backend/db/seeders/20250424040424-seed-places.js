'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Places', [
      { placeId: 1, name: 'Central Park', location: 'NYC', createdAt: new Date(), updatedAt: new Date(), description: 'A large public park in the heart of Manhattan.' },
      { placeId: 2, name: 'Golden Gate Park', location: 'San Francisco', createdAt: new Date(), updatedAt: new Date(), description: 'A large urban park in San Francisco.' },
      { placeId: 3, name: 'Millennium Park', location: 'Chicago', createdAt: new Date(), updatedAt: new Date(), description: 'A large public park in the heart of Chicago.' },
      { placeId: 4, name: 'Balboa Park', location: 'San Diego', createdAt: new Date(), updatedAt: new Date(), description: 'A large urban park in San Diego.' }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Places');
  }
};
