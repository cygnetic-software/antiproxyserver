const express = require("express");
const router = express.Router();
const { connection, auth, db } = require("../../settings/setting");

router.post("/", (req, resp) => {
  const pending = req.body;
  if (pending) {
    if (pending.action == "approved") {
      connection.query(
        `INSERT INTO teachers VALUES (?, ?, ?, ?, ?);`,
        [
          pending.teacher.teacher_uid,
          pending.teacher.teacher_name,
          pending.teacher.teacher_email,
          pending.teacher.teacher_phone,
          pending.teacher.teacher_password,
        ],
        (err, res) => {
          if (err) {
            console.log(err);
            res.status(500).json({ err: "Error approving teacher!" });
            throw err;
          }
        }
      );
      db.collection("pending")
        .doc(pending.teacher.teacher_uid)
        .delete()
        .then((res) => {
          resp.status(200).json({
            message: "teacher approved",
          });
        })
        .catch((e) => {
          throw e;
        });
    } else {
      db.collection("pending")
        .doc(pending.teacher.teacher_uid)
        .delete()
        .then((res) => {
          auth
            .getAuth()
            .deleteUser(pending.teacher.teacher_uid)
            .then(() => {
              console.log("Successfully Teacher disapproved");

              resp.status(200).json({
                msg: "teacher  disapproved",
              });
            })
            .catch((error) => {
              throw error;
            });
        });
    }
  } else {
    resp.status(400).json({
      err: "No Action Provided",
    });
  }
});
module.exports = router;
