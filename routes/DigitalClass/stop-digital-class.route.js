const express = require("express");
const router = express.Router();
const { connection } = require("../../settings/setting");

router.post("/:lectureId", (req, res) => {
  res.status(200).json({ msg: "Class Ended" });
});

module.exports = router;
