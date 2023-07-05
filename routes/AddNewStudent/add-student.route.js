const express = require("express");
const router = express.Router();
const { db, auth } = require("../../settings/setting");

router.post("/", async (req, res) => {
  const studInfo = req.body;
  if (studInfo) {
    try {
      const userRecord = await auth.createUser({
        email: studInfo.reg_no + "@cust.pk",
        password: studInfo.password,
        displayName: studInfo.name,
      });
      console.log("Successfully created new user:", userRecord.uid);
      await db
        .collection("students")
        .doc(userRecord.uid)
        .set({
          reg_no: studInfo.reg_no,
          name: studInfo.name,
          degree: studInfo.degree,
          email: studInfo.reg_no + "@cust.pk",
          password: studInfo.password,
          additional_field: null,
        });
      res.status(200).json({ msg: "Added Student!", obj: userRecord });
    } catch (error) {
      console.log("Error creating new user:", error);
      if (error.code === "auth/email-already-exists") {
        res.status(400).json({ err: "Email Already Exists!" });
      } else {
        res.status(500).json({ err: "Error Adding Student!" });
      }
    }
  } else {
    res.status(400).json({ err: "Info Not provided" });
  }
});

module.exports = router;
