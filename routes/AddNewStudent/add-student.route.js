const express = require("express");
const router = express.Router();
const { connection, auth } = require("../../settings/setting");
router.post("/", (req, resp) => {
  const studInfo = req.body;
  if (studInfo) {
    auth
      .getAuth()
      .createUser({
        email: studInfo.reg_no + "@cust.pk",
        password: studInfo.password,
        displayName: studInfo.name,
      })
      .then((userRecord) => {
        console.log("Successfully created new user:", userRecord.uid);
        connection.query(
          `INSERT INTO students VALUES (?, ?, ?, ?, ?, ?);`,
          [
            userRecord.uid,
            studInfo.reg_no,
            studInfo.name,
            studInfo.degree,
            studInfo.reg_no + "@cust.pk",
            studInfo.password,
          ],
          (err, result) => {
            if (err) {
              console.log(e);
              auth
                .getAuth()
                .deleteUser(userRecord.uid)
                .then(() => {
                  console.log("Successfully Student Removed");
                })
                .catch((error) => {
                  console.log("Error deleting user:", error);
                });
              resp.status(500).json({ err: "Error Adding Student!" });
            }
            resp.status(200).json({ msg: "Added Student!", obj: result });
          }
        );
      })
      .catch((error) => {
        console.log("Error creating new user:", error);
      });
  } else {
    resp.status(400).json({ err: "Info Not provided" });
  }
});

module.exports = router;
