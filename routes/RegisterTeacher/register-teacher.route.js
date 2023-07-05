const express = require("express");
const router = express.Router();
const { connection, auth, db } = require("../../settings/setting");

router.post("/", (req, res) => {
  const creds = req.body;
  if (creds) {
    if (
      (creds.teacher_name != "" ||
        creds.teacher_phone != "" ||
        creds.teacher_email != "" ||
        creds.teacher_password != "") &&
      creds.teacher_name &&
      creds.teacher_phone &&
      creds.teacher_email &&
      creds.teacher_password
    ) {
      auth

        .createUser({
          email: creds.teacher_email,
          phoneNumber: creds.teacher_phone,
          password: creds.teacher_password,
          displayName: creds.teacher_name,
        })
        .then((userRecord) => {
          console.log("Successfully created new teacher:", userRecord.uid);
          const docRef = db.collection("pending").doc(userRecord.uid);
          docRef
            .set({
              teacher_uid: userRecord.uid,
              teacher_name: userRecord.displayName,
              teacher_phone: userRecord.phoneNumber,
              teacher_email: userRecord.email,
              teacher_password: creds.teacher_password,
            })
            .then(() => {
              res.status(200).json({
                code: 200,
                message:
                  "Account Created Successfully. Please contact admin for approval. ",
              });
            })
            .catch((e) => {
              console.log("Error Adding to Database time to roll back");
              auth.deleteUser(userRecord.uid).then(() => {
                const deldoc = db.collection("pending").doc(userRecord.uid);
                deldoc.delete().then(() => {
                  console.log("Teacher Account ROLLBACKED");
                });
              });
              res.status(400).json({
                err: "System error: Couldn't Create Account at this time",
              });
            });
        })
        .catch((error) => {
          console.log("Error creating new user:", error);
          res.status(400).json({
            err: "System error: ERMERRWHLADDTOAUTH",
            actualERR: error,
          });
        });
    } else {
      res.status(400).json({ err: "Incomplete Credentials" });
    }
  } else {
    res.status(400).json({ err: "Empty Credentials" });
  }
});

module.exports = router;
