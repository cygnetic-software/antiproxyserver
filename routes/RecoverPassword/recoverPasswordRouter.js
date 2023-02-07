require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const { connection, auth } = require("../../settings/setting");

router.post("/student", (req, res) => {
  console.log("recovering student");
  const { email } = req.body;
  connection.query(
    "SELECT * FROM students WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length !== 0) {
        // Construct password reset email template, embed the link and send
        const data = {
          service_id: "service_m1v4l14",
          template_id: "template_dmfukbs",
          user_id: "xp-KMU60lbVqCzHoH",
          template_params: {
            email: email,
            link: `http://localhost:3000/reset-password?email=${email}`,
            name: result[0].name,
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
      }
    }
  );
});
router.post("/teacher", (req, res) => {
  console.log("recovering teacher");
  const { email } = req.body;
  connection.query(
    "SELECT * FROM teacher WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length !== 0) {
        // Construct password reset email template, embed the link and send
        const data = {
          service_id: "service_m1v4l14",
          template_id: "template_dmfukbs",
          user_id: "xp-KMU60lbVqCzHoH",
          template_params: {
            email: email,
            link: `http://localhost:3000/reset-password-teacher?email=${email}`,
            name: result[0].name,
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
      }
    }
  );
});
module.exports = router;
