"use strict";

let options = { tableName: "Media" };

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          eventId: 1,
          url: "https://picsum.photos/200/300",
          storagePath: "web-uploads/seed1.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 245123,
          originalName: "seed1.jpg",
          mediaType: "image",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          eventId: 2,
          url: "https://picsum.photos/200/300", // ✅ fixed the "hhttps"
          storagePath: "web-uploads/seed2.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 312890,
          originalName: "seed2.jpg",
          mediaType: "image",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          eventId: 3,
          url: "https://picsum.photos/200/300",
          storagePath: "web-uploads/seed3.mp4",
          folder: "web-uploads",
          contentType: "video/mp4",
          sizeBytes: 9450123,
          originalName: "seed3.mp4",
          mediaType: "video",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 4,
          eventId: 4,
          url: "https://picsum.photos/200/300",
          storagePath: "web-uploads/seed4.mp4",
          folder: "web-uploads",
          contentType: "video/mp4",
          sizeBytes: 12045012,
          originalName: "seed4.mp4",
          mediaType: "video",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(options, null, {});
  },
};

