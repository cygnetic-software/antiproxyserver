const express = require("express");
const router = express.Router();
const qrcode = require("qrcode");
const crypto = require("crypto");
const { connection } = require("../../settings/setting");

function generateRandomString(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  let bytes = crypto.randomBytes(length);
  for (let i = 0; i < bytes.length; i++) {
    result += charset[bytes.readUInt8(i) % charset.length];
  }
  return result;
}

router.post("/:lectureId", (req, res) => {
  const lecture_id = req.params.lectureId;
  const randomString = generateRandomString(8);
  console.log(randomString);
  const code_id = randomString;
  const sql = `SELECT students.* FROM lecture_students
  JOIN students ON lecture_students.stud_id = students.stud_id
  WHERE lecture_id = ?`;

  connection.query(sql, [lecture_id], (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    qrcode.toDataURL(code_id, (err, url) => {
      res.status(200).json({ data: results, qrcode: url, code: code_id });
    });
  });
});

module.exports = router;
