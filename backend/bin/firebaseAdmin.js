const {
  cert,
  getApps,
  initializeApp,
} = require("firebase-admin/app");

const { getStorage } = require("firebase-admin/storage");

function requiredEnvironmentVariable(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const firebaseProjectId = requiredEnvironmentVariable(
  "FIREBASE_ADMIN_PROJECT_ID"
);

const firebaseClientEmail = requiredEnvironmentVariable(
  "FIREBASE_ADMIN_CLIENT_EMAIL"
);

const firebasePrivateKey = requiredEnvironmentVariable(
  "FIREBASE_ADMIN_PRIVATE_KEY"
).replace(/\\n/g, "\n");

const firebaseStorageBucket = requiredEnvironmentVariable(
  "FIREBASE_ADMIN_STORAGE_BUCKET"
);

const firebaseApp =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: firebaseProjectId,
      clientEmail: firebaseClientEmail,
      privateKey: firebasePrivateKey,
    }),
    storageBucket: firebaseStorageBucket,
  });

const firebaseBucket = getStorage(firebaseApp).bucket();

module.exports = {
  firebaseApp,
  firebaseBucket,
};