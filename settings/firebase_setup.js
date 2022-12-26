const { initializeApp, applicationDefault } = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

module.exports = db;
