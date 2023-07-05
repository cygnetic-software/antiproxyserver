const express = require("express");
const router = express.Router();
const { db } = require("../../settings/setting");

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const adminRef = db.collection("admin");
    const snapshot = await adminRef.where("email", "==", email).get();

    if (snapshot.empty) {
      res.status(401).json({ msg: "Invalid Email!" });
    } else {
      res.status(200).json({ msg: "Success" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server Error!" });
  }
});

module.exports = router;
