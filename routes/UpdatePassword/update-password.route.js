require("dotenv").config();
const express = require("express");
const router = express.Router();

const { connection, auth, db } = require("../../settings/setting");

router.post("/student", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    "UPDATE students SET password = ? WHERE email = ?",
    [password, email],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: err });
      } else {
        res.status(200).json({ message: "Password Updated" });
      }
    }
  );
});
router.post("/teacher", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    "UPDATE teachers SET teacher_password = ? WHERE teacher_email = ?",
    [password, email],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: err });
      } else {
        res.status(200).json({ message: "Password Updated" });
      }
    }
  );
});

module.exports = router;
