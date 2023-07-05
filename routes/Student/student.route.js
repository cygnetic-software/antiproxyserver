const express = require("express");
const router = express.Router();
const { auth, db } = require("../../settings/setting");

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("students").get();
    let students = [];

    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();
      students.push({ id, ...data });
    });

    res.status(200).json({ students: students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

router.delete("/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    await db.collection("students").doc(studentId).delete();

    auth

      .deleteUser(studentId)
      .then(() => {
        res.status(200).json({ message: "Student deleted successfully" });
      })
      .catch((e) => {
        return res.status(500).json({ message: "Couldn't Delete User" });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

router.put("/:studentId/remove-device", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const doc = db.collection("students").doc(studentId);
    await doc.update({
      registered_device: false,
    });

    res.status(200).json({ message: "Registered device removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove registered device" });
  }
});

router.put("/:studentId/register-device", async (req, res) => {
  const studentId = req.params.studentId;
  const registeredDevice = req.body.deviceId;

  if (!registeredDevice) {
    return res.status(400).json({ error: "Device ID is required" });
  }

  try {
    const doc = db.collection("students").doc(studentId);
    await doc.update({ registered_device: registeredDevice });

    res.status(200).json({ message: "Device registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register device" });
  }
});

module.exports = router;
