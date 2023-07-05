const express = require("express");
const router = express.Router();
const { auth, db } = require("../../settings/setting");

router.post("/", async (req, resp) => {
  const pending = req.body;
  if (pending) {
    if (pending.action === "approved") {
      const teacherRef = db
        .collection("teachers")
        .doc(pending.teacher.teacher_uid);
      const teacherData = {
        teacher_name: pending.teacher.teacher_name,
        teacher_email: pending.teacher.teacher_email,
        teacher_phone: pending.teacher.teacher_phone,
        teacher_password: pending.teacher.teacher_password,
      };
      try {
        await teacherRef.set(teacherData);
        await db
          .collection("pending")
          .doc(pending.teacher.teacher_uid)
          .delete();
        resp.status(200).json({
          message: "teacher approved",
        });
      } catch (e) {
        console.error(e);
        resp.status(500).json({ err: "Error approving teacher!" });
      }
    } else {
      try {
        await db
          .collection("pending")
          .doc(pending.teacher.teacher_uid)
          .delete();
        await auth.deleteUser(pending.teacher.teacher_uid);
        resp.status(200).json({
          msg: "teacher disapproved",
        });
      } catch (error) {
        console.error(error);
        resp.status(500).json({ err: "Error disapproving teacher!" });
      }
    }
  } else {
    resp.status(400).json({
      err: "No Action Provided",
    });
  }
});
module.exports = router;
