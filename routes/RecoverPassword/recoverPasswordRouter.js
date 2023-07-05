require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { db } = require("../../settings/setting");

router.post("/student", async (req, res) => {
  console.log("recovering student");
  const { email } = req.body;

  const studentsRef = db.collection("students");
  const snapshot = await studentsRef.where("email", "==", email).get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    res.status(404).json({ message: "User not found" });
    return;
  }

  snapshot.forEach((doc) => {
    const data = {
      service_id: "service_m1v4l14",
      template_id: "template_dmfukbs",
      user_id: "xp-KMU60lbVqCzHoH",
      template_params: {
        email: email,
        link: `http://localhost:3000/reset-password?email=${email}`,
        name: doc.data().name,
      },
      accessToken: "59qXHnKaCRrNH_D8FV7xU",
    };
    axios
      .post("https://api.emailjs.com/api/v1.0/email/send", data)
      .then((e) => {
        console.log("Email Sent");
        res.status(200).json({ message: "Success" });
      })
      .catch((e) => {
        console.log(e);
        res.status(400).json({ message: "Error" });
      });
  });
});

router.post("/teacher", async (req, res) => {
  console.log("recovering teacher");
  const { email } = req.body;

  const teachersRef = db.collection("teachers");
  const snapshot = await teachersRef.where("teacher_email", "==", email).get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    res.status(404).json({ message: "User not found" });
    return;
  }

  snapshot.forEach((doc) => {
    const data = {
      service_id: "service_m1v4l14",
      template_id: "template_dmfukbs",
      user_id: "xp-KMU60lbVqCzHoH",
      template_params: {
        email: email,
        link: `http://localhost:3000/reset-password-teacher?email=${email}`,
        name: doc.data().teacher_name,
      },
      accessToken: "59qXHnKaCRrNH_D8FV7xU",
    };
    axios
      .post("https://api.emailjs.com/api/v1.0/email/send", data)
      .then((e) => {
        console.log("Email Sent");
        res.status(200).json({ message: "Success" });
      })
      .catch((e) => {
        console.log(e);
        res.status(400).json({ message: "Error" });
      });
  });
});

module.exports = router;
