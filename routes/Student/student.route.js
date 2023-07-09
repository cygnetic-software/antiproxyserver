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

  // Start a batch
  const batch = db.batch();

  try {
    const studentDocRef = db.collection("students").doc(studentId);
    batch.delete(studentDocRef);

    const lectureStudentsSnapshot = await db
      .collection("lecture-students")
      .where("stud_id", "==", studentId)
      .get();
    lectureStudentsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const reportsSnapshot = await db
      .collection("reports")
      .where("stud_id", "==", studentId)
      .get();
    reportsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    await auth.deleteUser(studentId);

    res.status(200).json({ message: "Student deleted successfully" });
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
      registered_device: null,
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
    // First, check if device is already registered to another student
    const snapshot = await db
      .collection("students")
      .where("registered_device", "==", registeredDevice)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return res
        .status(400)
        .json({ error: "Device already registered to another student" });
    }

    // If no documents are found, it's safe to register the device to this student
    const doc = db.collection("students").doc(studentId);
    await doc.update({ registered_device: registeredDevice });

    res.status(200).json({ message: "Device registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register device" });
  }
});

module.exports = router;
