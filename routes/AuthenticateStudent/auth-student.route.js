const express = require("express");
const router = express.Router();
const { auth, db } = require("../../settings/setting");
router.post("/", async (req, res) => {
  const data = req.body;

  console.log(data);
  if (data.email !== "" && data.password !== "") {
    try {
      const studentsRef = db.collection("students");
      const snapshot = await studentsRef.where("email", "==", data.email).get();
      if (snapshot.empty) {
        res.status(401).json({ err: "Email does not Exist" });
      } else {
        let userData;
        snapshot.docs.forEach((doc) => {
          const id = doc.id;
          userData = { stud_id: id, ...doc.data() };
        });
        console.log(userData);

        if (userData.password !== data.password) {
          res.status(401).json({ err: "Invalid password" });
        } else {
          auth

            .createCustomToken(userData.stud_id)
            .then((customToken) => {
              res.status(200).json({
                msg: "Success",
                token: customToken,
                userdata: userData,
              });
            })
            .catch((error) => {
              res.status(500).json({
                err: error.toString(),
              });
            });
        }
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ err: "Internal Server Error: 500", actualErr: err });
    }
  }
});

module.exports = router;
