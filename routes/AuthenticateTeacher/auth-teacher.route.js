const express = require("express");
const router = express.Router();
const { connection, auth, db } = require("../../settings/setting");
router.post("/", (req, res) => {
  const data = req.body;
  console.log(data);
  connection.query(
    `SELECT teacher_id FROM teachers where teacher_email = '${data.email}' and teacher_password = '${data.password}'`,
    (err, result) => {
      if (err) {
        res.status(400).json({
          err: "Invalid Credentials",
        });
      }
      auth
        .getAuth()
        .createCustomToken(result[0].teacher_id)
        .then((customToken) => {
          res.status(200).json({ msg: "Success", token: customToken });
        })
        .catch((error) => {
          res.status(500).json({
            err: error,
          });
        });
    }
  );
});
module.exports = router;
