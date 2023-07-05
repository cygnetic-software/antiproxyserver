const express = require("express");
const router = express.Router();
const { auth, db } = require("../../settings/setting");

router.post("/", async (req, res) => {
  const data = req.body;

  if (data.email !== "" && data.password !== "") {
    try {
      const teachersRef = db.collection("teachers");
      const snapshot = await teachersRef
        .where("teacher_email", "==", data.email)
        .get();

      if (snapshot.empty) {
        res.status(401).json({ err: "Email does not Exist" });
      } else {
        let userData;
        snapshot.forEach((doc) => {
          userData = { teacher_id: doc.id, ...doc.data() };
        });
        if (userData.teacher_password !== data.password) {
          res.status(401).json({ err: "Invalid password" });
        } else {
          auth
            .createCustomToken(userData.teacher_id)
            .then((customToken) => {
              res.status(200).json({ msg: "Success", token: customToken });
            })
            .catch((error) => {
              res.status(500).json({
                err: error.toString(),
              });
            });
        }
      }
    } catch (err) {
      res.status(500).json({ err: "Internal Server Error", actualErr: err });
    }
  } else {
    res.status(400).json({ err: "Empty input fields" });
  }
});

module.exports = router;
