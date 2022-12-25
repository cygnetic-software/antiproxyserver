const mysql = require("mysql");
const express = require("express");
const auth = require("firebase-admin/auth");
const cors = require("cors");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const PORT = 8000;

// Setting up firebase and sql
initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const connection = mysql.createConnection({
  user: "zax",
  password: "1234",
  host: "localhost",
  database: "antiproxyDB",
});

connection.connect();
connection.on("error", (err) => {
  console.log(err);
});

// Initializing Server
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

//Requests
app.post("/register-new-teacher", (req, res) => {
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
        .getAuth()
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
                message: "Teacher Created and Stored Successfully!",
              });
            })
            .catch((e) => {
              /*
                ROLL BACK PENDING
            */
              console.log("Error Adding to Database time to roll back");
              res.status(400).json({ err: "System error: ERMERRWHLADDTOFS" });
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
app.post("/teacher-action", (req, res) => {
  const pending = req.body;
  if (pending) {
    if (pending.action == "approved") {
      connection
        .query(
          `INSERT INTO teachers VALUES (${pending.teacher.teacher_uid}, ${pending.teacher.teacher_name}, ${pending.teacher.teacher_email}, ${pending.teacher.teacher_phone});`
        )
        .on("error", (e) => {
          console.log(e);
          res.status(500).json({ err: "Error approving teacher!" });
        });
      db.collection("pending")
        .doc(pending.teacher.teacher_uid)
        .delete()
        .then((res) => {
          res.status(200).json({
            message: "teacher approved",
          });
        })
        .catch((e) => {
          res.status(400).json({
            err: "teacher not approved",
          });
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
            })
            .catch((error) => {
              console.log("Error deleting user:", error);
            });
        });
    }
  } else {
    res.status(400).json({
      err: "No Action Provided",
    });
  }
});
app.post("/add-new-student", (req, res) => {
  const studInfo = req.body;
  if (studInfo) {
    getAuth()
      .createUser({
        email: studInfo.reg_no + "@cust.pk",
        password: studInfo.password,
        displayName: studInfo.name,
      })
      .then((userRecord) => {
        console.log("Successfully created new user:", userRecord.uid);
        connection
          .query(
            `INSERT INTO students VALUES (${userRecord.uid}, ${
              studInfo.reg_no
            }, ${studInfo.name}, ${studInfo.degree}, ${
              studInfo.reg_no + "@cust.pk"
            });`
          )
          .on("error", (e) => {
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
            res.status(500).json({ err: "Error Adding Student!" });
          });
      })
      .catch((error) => {
        console.log("Error creating new user:", error);
      });
  } else {
    res.status(400).json({ err: "Info Not provided" });
  }
});
//Running Server
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
