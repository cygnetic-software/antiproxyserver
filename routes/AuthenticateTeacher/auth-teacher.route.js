const express = require("express");
const router = express.Router();
const { connection, auth, db } = require("../../settings/setting");
router.post("/", (req, res) => {
  const data = req.body;

  console.log(data);
  if (data.email !== "" && data.password !== "") {
    connection.query(
      "SELECT * FROM teachers WHERE teacher_email = ?",
      [data.email],
      (err, result) => {
        if (err) {
          res.status(500).json({ err: "Internal Server Error" });
        }
        console.log(result);
        if (result.length === 0) {
          res.status(401).json({ err: "Email does not Exist" });
        } else {
          if (result[0].teacher_password !== data.password) {
            res.status(401).json({ err: "Invalid password" });
          } else {
            auth
              .getAuth()
              .createCustomToken(result[0].teacher_id)
              .then((customToken) => {
                res.status(200).json({ msg: "Success", token: customToken });
              })
              .catch((error) => {
                res.status(500).json({
                  err: error.toString(),
                });
              });
          }
        }
      }
    );
  } else {
    res.status(400).json({ err: "Empty input fields" });
  }
});
module.exports = router;
