const express = require("express");
const router = express.Router();
const { connection, auth, db } = require("../../settings/setting");
router.post("/", (req, res) => {
  const { email } = req.body;
  connection.query(
    `SELECT * FROM admin WHERE email = ?`,
    [email],
    (err, result) => {
      if (err) {
        res.status(500).json({ msg: "Server Error!" });
      }
      if (result.length === 0) {
        res.status(401).json({ msg: "Invalid Email!" });
      } else {
        res.status(200).json({ msg: "Success" });
      }
    }
  );
});
module.exports = router;
