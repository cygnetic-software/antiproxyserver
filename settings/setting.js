require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const https = require("https");
const fs = require("fs");

const { initializeApp, applicationDefault } = require("firebase-admin/app");

const { getFirestore } = require("firebase-admin/firestore");

const app = express();

// Create https server
const server = https.createServer(
  {
    key: fs.readFileSync("../my_certs/privkey.pem"),
    cert: fs.readFileSync("../my_certs/fullchain.pem"),
  },
  app
);

const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

initializeApp({
  credential: applicationDefault(),
});

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for
  // this URL must be whitelisted in the Firebase Console.
  url: "https://16.171.135.163:443/recover-student-password",
  // This must be true for email link sign-in.
  handleCodeInApp: true,
  iOS: {
    bundleId: "com.example.antiproxystudent",
  },
  android: {
    packageName: "com.example.antiproxystudent",
    installApp: true,
    minimumVersion: "12",
  },
  // FDL custom domain.
  dynamicLinkDomain: "antiproxy.page.link",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});

const db = getFirestore();
const auth = admin.auth();
const classData = {};

module.exports = {
  db,
  transporter,
  actionCodeSettings,
  io,
  server,
  classData,
  app,
  auth,
  admin,
};
