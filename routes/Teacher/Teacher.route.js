const express = require("express");
const router = express.Router();
const { db, auth } = require("../../settings/setting"); // Assuming setting.js now exports Firestore database

// Fetch all teachers
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("teachers").get();
    let teachers = [];

    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();
      teachers.push({ uid: id, ...data });
    });

    res.status(200).json({ teachers: teachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

// Delete a specific teacher
router.delete("/:teacherId", async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    await db.collection("teachers").doc(teacherId).delete();

    auth

      .deleteUser(teacherId)
      .then(() => {
        res.status(200).json({ message: "Teacher deleted successfully" });
      })
      .catch((e) => {
        return res.status(500).json({ message: "Couldn't Delete Teacher" });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete teacher" });
  }
});

module.exports = router;
