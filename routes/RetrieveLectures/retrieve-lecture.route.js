const express = require("express");
const router = express.Router();
const { db } = require("../../settings/setting"); // Assuming setting.js now exports Firestore database

router.post("/", async (req, res) => {
  const teacherID = req.body.teacherID;

  try {
    const snapshot = await db
      .collection("lectures")
      .where("teacher_id", "==", teacherID)
      .get();

    // Array to hold all promises
    const allLecturesPromises = snapshot.docs.map(async (lecture) => {
      let lectureData = lecture.data();

      // Fetch course_name
      const courseSnapshot = await db
        .collection("courses")
        .where("course_code", "==", lectureData.course_code)
        .get();

      let course_name = "";
      courseSnapshot.forEach((doc) => {
        let data = doc.data();
        course_name = data.course_name; // Assuming the field for course name in courses collection is 'course_name'
      });

      lectureData.course_name = course_name;

      return { id: lecture.id, ...lectureData };
    });

    // Wait for all promises to resolve
    const lectures = await Promise.all(allLecturesPromises);

    res.status(200).json({ msg: lectures });
  } catch (err) {
    console.error("Error fetching lectures:", err);
    res.status(500).json({ message: "Error fetching lectures" });
  }
});

router.post("/qr", async (req, res) => {
  const { code, stud_id } = req.body;

  if (code && stud_id) {
    try {
      // Get lectures
      const lecturesSnapshot = await db
        .collection("Qr")
        .doc(code)
        .collection("lectures")
        .get();
      let lectures = [];
      lecturesSnapshot.forEach((doc) => {
        let id = doc.id;
        let data = doc.data();
        lectures.push({ id, ...data });
      });

      if (lectures.length === 0) {
        res.status(400).json({ err: "Lecture Not Found!" });
        return;
      }

      // Get student's registered device
      const studentDoc = await db.collection("students").doc(stud_id).get();
      const studentData = studentDoc.data();

      if (!studentData.registered_device) {
        res
          .status(400)
          .json({ err: "Student does not have a registered device!" });
        return;
      }

      // Check if student is enrolled in the lecture
      const studentLectureSnapshot = await db
        .collection("lecture_students")
        .where("lecture_id", "==", lectures[0].lecture_id)
        .where("stud_id", "==", stud_id)
        .get();

      if (studentLectureSnapshot.empty) {
        res.status(400).json({ err: "Student not enrolled in this lecture!" });
        return;
      }

      res.status(200).json({ msg: "Lecture Found!", data: lectures[0] });
    } catch (err) {
      console.error("Error fetching lectures:", err);
      res.status(500).json({ message: "Error fetching lectures" });
    }
  } else {
    res.status(400).json({ err: "Qr code or Student ID is empty" });
  }
});

module.exports = router;
