const express = require("express");
const router = express.Router();
const qrcode = require("qrcode");
const { connection } = require("../../settings/setting");

router.post("/:lectureId", (req, res) => {
  const lecture_id = req.params.lectureId;
  const code_id = "12345";
  const sql = `SELECT students.* FROM lecture_students
JOIN students ON lecture_students.stud_id = students.stud_id
WHERE lecture_id = ?`;

  connection.query(sql, [lecture_id], (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    qrcode.toDataURL(code_id, (err, url) => {
      res.status(200).json({ data: results, qrcode: url });
    });
  });
});

module.exports = router;
