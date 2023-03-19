require("dotenv").config();
const express = require("express");
const router = express.Router();

const { connection, auth, db } = require("../../settings/setting");

router.post("/student", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const sql = "SELECT * FROM students WHERE email = ?";
  connection.query(sql, [email], (err, users) => {
    if (err) {
      console.log(err);
      throw err;
    }
    if (users.length !== 0) {
      auth
        .getAuth()
        .updateUser(users[0].stud_id, { password: password })
        .then(() => {
          connection.query(
            "UPDATE students SET password = ? WHERE email = ?",
            [password, email],
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).json({ message: err });
              } else {
                console.log("done");
                res.status(200).json({ message: "Password Updated" });
              }
            }
          );
        })
        .catch((e) => {
          res.status(500).json({ message: e });
        });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  });
});
router.post("/teacher", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM teachers WHERE teacher_email = ?";
  connection.query(sql, [email], (err, users) => {
    if (err) {
      console.log(err);
      throw err;
    }
    if (users.length !== 0) {
      auth
        .getAuth()
        .updateUser(users[0].teacher_id, { password: password })
        .then(() => {
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
    }
  });
});

module.exports = router;
