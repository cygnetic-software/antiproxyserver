require("dotenv").config();
const express = require("express");
const router = express.Router();
const { auth, db } = require("../../settings/setting");

router.post("/student", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const studentsRef = db.collection("students");
  const snapshot = await studentsRef.where("email", "==", email).get();

  if (snapshot.empty) {
    console.log("No matching student.");
    return res.status(400).json({ message: "User not found" });
  }

  snapshot.forEach((doc) => {
    const student = doc.data();
    auth
      .gethAuth()
      .updateUser(student.stud_id, { password: password })
      .then(() => {
        doc.ref.update({ password: password });
        res.status(200).json({ message: "Password Updated" });
      })
      .catch((e) => {
        console.error(e);
        res.status(500).json({ message: e });
      });
  });
});

router.post("/teacher", async (req, res) => {
  const { email, password } = req.body;

  const teachersRef = db.collection("teachers");
  const snapshot = await teachersRef.where("teacher_email", "==", email).get();

  if (snapshot.empty) {
    console.log("No matching teacher.");
    return res.status(400).json({ message: "User not found" });
  }

  snapshot.forEach((doc) => {
    const teacher = doc.data();
    auth

      .updateUser(teacher.teacher_id, { password: password })
      .then(() => {
        doc.ref.update({ teacher_password: password });
        res.status(200).json({ message: "Password Updated" });
      })
      .catch((e) => {
        console.error(e);
        res.status(500).json({ message: e });
      });
  });
});

module.exports = router;
