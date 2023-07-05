const express = require("express");
const router = express.Router();
const { db } = require("../../settings/setting"); // assuming setting now exports firestore db

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("reports").get();
    let reports = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();
      reports.push({ id, ...data });
    });
    res.status(200).json({ reports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

router.post("/", async (req, res) => {
  const { stud_id, teacher_id, lecture_id, report_text, report_type } =
    req.body;

  try {
    const docRef = await db.collection("reports").add({
      stud_id,
      teacher_id,
      lecture_id,
      report_text,
      report_type,
    });
    res.status(201).json({
      message: "Report created successfully",
      reportId: docRef.id,
    });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ message: "Error creating report" });
  }
});

module.exports = router;
