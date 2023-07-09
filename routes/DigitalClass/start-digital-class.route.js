const express = require("express");
const router = express.Router();
const { io, db, classData } = require("../../settings/setting");
const crypto = require("crypto");
const Qr = require("../../model/qr.model");

function generateRandomString(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  let bytes = crypto.randomBytes(length);
  for (let i = 0; i < bytes.length; i++) {
    result += charset[bytes.readUInt8(i) % charset.length];
  }
  return result;
}

router.post("/:lectureId", async (req, res) => {
  const lecture_id = req.params.lectureId;
  const randomString = generateRandomString(8);
  const code_id = randomString;
  const Qrcode = new Qr(code_id);

  try {
    const { code, url } = await Qrcode.generateQR(lecture_id);
    const lectureStudentsRef = db.collection("lecture-students");

    const snapshot = await lectureStudentsRef
      .where("lecture_id", "==", lecture_id)
      .get();
    const students = snapshot.docs.map((doc) => doc.data().stud_id);
    const lectureStudents = [];
    const allStudentsPromise = students.map(async (studentDoc) => {
      const studentSnapshot = await db
        .collection("students")
        .doc(studentDoc)
        .get();
      const studentData = studentSnapshot.data();
      lectureStudents.push({ stud_id: studentSnapshot.id, ...studentData });
    });
    await Promise.all(allStudentsPromise);
    // Generate your QR here. It's code_id in this context.

    const roomId = `class-${lecture_id}`;
    classData[roomId] = {
      teacher: null,
      attendees: new Map(),
      absentees: new Map(
        lectureStudents.map((student) => [student.stud_id, student])
      ),
      exceptions: new Map(),
    };

    io.on("connection", (socket) => {
      socket.on("joinRoom", (data) => {
        const { roomId, userId, userType, user } = data;
        socket.join(roomId);

        if (userType === "teacher") {
          classData[roomId].teacher = user;
        } else if (userType === "student") {
          classData[roomId].attendees.set(userId, user);
          classData[roomId].absentees.delete(userId);
        }

        io.to(roomId).emit("userConnected", {
          userId,
          userType,
          user,
          teacher: classData[roomId].teacher,
          attendees: Array.from(classData[roomId].attendees.values()),
          absentees: Array.from(classData[roomId].absentees.values()),
          exceptions: Array.from(classData[roomId].exceptions.values()),
        });
      });

      socket.on("addAbsentee", (data) => {
        console.log("Call to add student");
        const { roomId, userId } = data;

        if (classData[roomId].absentees.has(userId)) {
          console.log("i m here in add student if");
          const user = classData[roomId].absentees.get(userId);

          classData[roomId].absentees.delete(userId);
          classData[roomId].attendees.set(userId, user);

          io.to(roomId).emit("absenteeAdded", {
            userId,
            user,
            attendees: Array.from(classData[roomId].attendees.values()),
            absentees: Array.from(classData[roomId].absentees.values()),
            exceptions: Array.from(classData[roomId].exceptions.values()),
          });
        }
      });

      socket.on("removeAttendee", (data) => {
        console.log("Call to remove student");
        const { roomId, userId } = data;

        if (classData[roomId].attendees.has(userId)) {
          const user = classData[roomId].attendees.get(userId);

          classData[roomId].attendees.delete(userId);
          classData[roomId].absentees.set(userId, user);

          io.to(roomId).emit("attendeeRemoved", {
            userId,
            user,
            attendees: Array.from(classData[roomId].attendees.values()),
            absentees: Array.from(classData[roomId].absentees.values()),
            exceptions: Array.from(classData[roomId].exceptions.values()),
          });
        }
      });

      socket.on("studentLeave", (data) => {
        console.log("Call to student leave");
        const { roomId, userId, user } = data;
        classData[roomId].attendees.delete(userId);
        classData[roomId].exceptions.set(userId, user);

        io.to(roomId).emit("userLeft", {
          userId,
          user,
          attendees: Array.from(classData[roomId].attendees.values()),
          absentees: Array.from(classData[roomId].absentees.values()),
          exceptions: Array.from(classData[roomId].exceptions.values()),
        });

        socket.leave(roomId);
      });
      socket.on("removeException", (data) => {
        console.log("Call to remove exception student");
        const { roomId, userId } = data;

        if (classData[roomId].exceptions.has(userId)) {
          const user = classData[roomId].exceptions.get(userId);

          classData[roomId].exceptions.delete(userId);
          classData[roomId].attendees.set(userId, user);

          io.to(roomId).emit("exceptionRemoved", {
            userId,
            user,
            attendees: Array.from(classData[roomId].attendees.values()),
            absentees: Array.from(classData[roomId].absentees.values()),
            exceptions: Array.from(classData[roomId].exceptions.values()),
          });
        }
      });
    });

    res
      .status(200)
      .json({ response: { url: url, code: code }, data: lectureStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
