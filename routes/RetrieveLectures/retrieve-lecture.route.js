const express = require("express");
const router = express.Router();
const { db } = require("../../settings/setting"); // Assuming setting.js now exports Firestore database

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("lectures").get();

    // Array to hold all promises
    const allLecturesPromises = snapshot.docs.map(async (lecture) => {
      let lectureData = lecture.data();

      // Fetch course_name
      // Fetch teacher_name
      const teacherSnapshot = await db
        .collection("teachers")
        .doc(lectureData.teacher_id)
        .get();

      let teacher_name = "";
      if (teacherSnapshot.exists) {
        teacher_name = teacherSnapshot.data().teacher_name; // Assuming the field for teacher name in teachers collection is 'teacher_name'
      }

      lectureData.teacher_name = teacher_name;

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

router.get("/:lectureId/students", async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    const lectureStudentsSnapshot = await db
      .collection("lecture-students")
      .where("lecture_id", "==", lectureId)
      .get();

    // Array to hold all promises
    let allStudentPromises = lectureStudentsSnapshot.docs.map(async (doc) => {
      const studentId = doc.data().stud_id;
      const studentSnapshot = await db
        .collection("students")
        .doc(studentId)
        .get();

      return { stud_id: studentId, ...studentSnapshot.data() };
    });

    // Wait for all promises to resolve
    const students = await Promise.all(allStudentPromises);
    res.status(200).json({ students });
  } catch (err) {
    console.error("Error fetching students for the lecture:", err);
    res
      .status(500)
      .json({ message: "Error fetching students for the lecture" });
  }
});
router.post("/:lectureId/students/:studId", async (req, res) => {
  const { lectureId, studId } = req.params;

  // Check if student already exists in "lecture-students" collection
  try {
    const studentSnapshot = await db
      .collection("lecture-students")
      .where("lecture_id", "==", lectureId)
      .where("stud_id", "==", studId)
      .get();

    if (!studentSnapshot.empty) {
      return res.status(400).json({ message: "Student already in lecture" });
    }

    // If not present, add student to lecture
    const addStudent = await db
      .collection("lecture-students")
      .add({ lecture_id: lectureId, stud_id: studId });

    return res.status(200).json({ message: "Student added to lecture" });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Failed to add student" });
  }
});

router.delete("/:lectureId/students/:studId", async (req, res) => {
  const { lectureId, studId } = req.params;

  // Delete student from "lecture-students" collection
  try {
    await db
      .collection("lecture-students")
      .where("lecture_id", "==", lectureId)
      .where("stud_id", "==", studId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          docSnapshot.ref.delete();
        });
      });

    res.status(200).json({ msg: "Success" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

router.put("/:lectureId/edit", async (req, res) => {
  try {
    const { teacher_id, time_slot } = req.body;

    // Check if both fields are provided
    if (!teacher_id || !time_slot) {
      return res
        .status(400)
        .json({ message: "Please provide both teacher_id and time_slot." });
    }

    // Update the lecture
    await db
      .collection("lectures")
      .doc(req.params.lectureId)
      .update({ teacher_id, time_slot });

    // Fetch the updated list of lectures
    const snapshot = await db.collection("lectures").get();
    const lectures = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    // Respond with the updated list
    res.status(200).json({ msg: "Successfully updated lecture", lectures });
  } catch (err) {
    console.error("Error updating lecture:", err);
    res.status(500).json({ message: "Error updating lecture" });
  }
});

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
  console.log(stud_id);
  if (code && stud_id) {
    try {
      // Get lectures
      const qrSnapshot = await db
        .collection("Qr")
        .where("qr_code", "==", code)
        .get();

      if (qrSnapshot.empty) {
        res.status(400).json({ err: "QR Code Not Found!" });
        return;
      }

      let qrData = qrSnapshot.docs[0].data();
      let lectureId = qrData.lecture_id; // Assuming the field name is 'lecture_id' in your 'Qr' collection

      const lectureSnapshot = await db
        .collection("lectures")
        .doc(lectureId)
        .get();
      if (!lectureSnapshot.exists) {
        res.status(400).json({ err: "Lecture Not Found!" });
        return;
      }

      let lectureData = lectureSnapshot.data();

      let courseCode = lectureData.course_code; // Assuming the field name is 'course_code' in your 'lectures' collection

      const courseSnapshot = await db
        .collection("courses")
        .where("course_code", "==", courseCode)
        .get();

      if (courseSnapshot.empty) {
        res.status(400).json({ err: "Course Not Found!" });
        return;
      }

      let courseName = courseSnapshot.docs[0].data().course_name; // Assuming the field name is 'name' in your 'courses' collection

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
        .collection("lecture-students")
        .where("lecture_id", "==", lectureId)
        .where("stud_id", "==", stud_id)
        .get();

      if (studentLectureSnapshot.empty) {
        res.status(400).json({ err: "Student not enrolled in this lecture!" });
        return;
      }

      res.status(200).json({
        msg: "Lecture Found!",
        data: { course_name: courseName, ...lectureData },
      });
    } catch (err) {
      console.error("Error fetching lectures:", err);
      res.status(500).json({ message: "Error fetching lectures" });
    }
  } else {
    res.status(400).json({ err: "Qr code or Student ID is empty" });
  }
});

module.exports = router;
