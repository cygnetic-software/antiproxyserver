const express = require("express");
const cors = require("cors");
const { app, db, server } = require("./settings/setting");
const registerTeacherRouter = require("./routes/RegisterTeacher/register-teacher.route");
const teacherActionRouter = require("./routes/TeacherAction/teacher-action.route");
const addStudentRouter = require("./routes/AddNewStudent/add-student.route");
const authAdminRouter = require("./routes/AuthenticateAdmin/auth-admin.route");
const authTeacherRouter = require("./routes/AuthenticateTeacher/auth-teacher.route");
const authStudentRouter = require("./routes/AuthenticateStudent/auth-student.route");
const retrieveTeacherLecturesRouter = require("./routes/RetrieveLectures/retrieve-lecture.route");
const startDigitalClassRouter = require("./routes/DigitalClass/start-digital-class.route");
const stopDigitalClassRouter = require("./routes/DigitalClass/stop-digital-class.route");
const adminTodosRouter = require("./routes/AdminTodos/admin-todos.route");
const recoverPasswordRouter = require("./routes/RecoverPassword/recoverPasswordRouter");
const updatePasswordRouter = require("./routes/UpdatePassword/update-password.route");
const teacherRouter = require("./routes/Teacher/Teacher.route");
const studentRouter = require("./routes/Student/student.route");
const reportsRoute = require("./routes/ReportStudent/reportStudent.route");
const path = require("path");

// PORT
const PORT = 443;

// Initializing Server
const router = express.Router();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//Routers
router.use("/register-new-teacher", registerTeacherRouter);
router.use("/teacher", teacherRouter);
router.use("/teacher-action", teacherActionRouter);
router.use("/report", reportsRoute);
router.use("/student", studentRouter);
router.use("/add-new-student", addStudentRouter);
router.use("/auth-admin", authAdminRouter);
router.use("/auth-teacher", authTeacherRouter);
router.use("/auth-student", authStudentRouter);
router.use("/lectures", retrieveTeacherLecturesRouter);
router.use("/todos", adminTodosRouter);
router.use("/start-digital-class", startDigitalClassRouter);
router.use("/stop-digital-class", stopDigitalClassRouter);
router.use("/recover", recoverPasswordRouter);
router.use("/update-password", updatePasswordRouter);
router.get("/get-reports", async (req, res) => {
  try {
    const reportsSnapshot = await db.collection("reports").get();
    let reports = [];
    reportsSnapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        report_id: doc.id,
        lecture_id: data.lecture_id,
        stud_name: data.stud_name,
        teacher_name: data.teacher_name,
        reg_no: data.reg_no,
        report_text: data.report_text,
        report_time: data.report_time,
        report_type: data.report_type,
      });
    });
    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

// UseRoutes
app.use("/", router);

//Migaration to firebase from SQL
router.get("/insert-data/student", (req, res) => {
  const student = [
    {
      stud_id: "5dysT22AIEOQmONuOEMP3IkXrFf2",
      reg_no: "BCS193046",
      name: "Imran Khan",
      degree: "BSCS",
      email: "BCS193046@cust.pk",
      password: "123456789",
      registered_device: null,
      additional_field: null,
    },
    {
      stud_id: "8kRNRqQAjpatNnzo97W6TBTp2QI2",
      reg_no: "BCS193011",
      name: "Muhammad Umair",
      degree: "BSCS",
      email: "BCS193011@cust.pk",
      password: "123456789",
      registered_device: null,
      additional_field: null,
    },
    {
      stud_id: "AS1eIIpMtuT1wRIugWl0553Am2g2",
      reg_no: "BCS193001",
      name: "Muhammad Muneeb",
      degree: "BSCS",
      email: "BCS193001@cust.pk",
      password: "123456789",
      registered_device: null,
      additional_field: null,
    },
    {
      stud_id: "NvZnH2LlQqS48EG9XEtDEGBMY5Q2",
      reg_no: "BCS193031",
      name: "Noman Javed",
      degree: "BSCS",
      email: "BCS193031@cust.pk",
      password: "123456789",
      registered_device: null,
      additional_field: null,
    },
    {
      stud_id: "OB8thG0liQZGnLg0r3HykPyPFsa2",
      reg_no: "BCS193016",
      name: "Mian Muhammad Faraz",
      degree: "BSCS",
      email: "BCS193016@cust.pk",
      password: "faraz123",
      registered_device: "SP1A.210812.016",
      additional_field: null,
    },
    {
      stud_id: "rqh89crIqhYwjmatJUtg8DfQTs02",
      reg_no: "BCS193146",
      name: "Muhammad Shampoo",
      degree: "BSCS",
      email: "BCS193146@cust.pk",
      password: "123456789",
      registered_device: null,
      additional_field: null,
    },
  ];
  student.forEach((stud) => {
    db.collection("students").doc(stud.stud_id).set({
      reg_no: stud.reg_no,
      name: stud.name,
      degree: stud.degree,
      email: stud.email,
      password: stud.password,
      registered_device: stud.registered_device,
      additional_field: stud.additional_field,
    });
  });
});
router.get("/insert-data/teacher", (req, res) => {
  const teacher = [
    {
      teacher_id: "EjytKyRwXWY07H4GSWl5VLXAA132",
      teacher_name: "m faraz",
      teacher_email: "test@test.com",
      teacher_phone: "+923333333333",
      teacher_password: "123456789",
    },
    {
      teacher_id: "hM1v0awTVzX1c5VvA00JMOE5EiU2",
      teacher_name: "Muhammad Faraz",
      teacher_email: "faraxshams@gmail.com",
      teacher_phone: "+923235235237",
      teacher_password: "faraz1234",
    },
  ];
  teacher.forEach((pending) => {
    db.collection("teachers").doc(pending.teacher_id).set({
      teacher_name: pending.teacher_name,
      teacher_email: pending.teacher_email,
      teacher_phone: pending.teacher_phone,
      teacher_password: pending.teacher_password,
    });
  });
});
router.get("/insert-data/lecture", (req, res) => {
  const lecture = [
    {
      lecture_id: 1,
      teacher_id: "EjytKyRwXWY07H4GSWl5VLXAA132",
      time_slot: "0900-1100",
      date: "20-01-2023",
      course_code: "CSE101",
    },
    {
      lecture_id: 2,
      teacher_id: "EjytKyRwXWY07H4GSWl5VLXAA132",
      time_slot: "1100-1300",
      date: "20-01-2023",
      course_code: "CSE102",
    },
    {
      lecture_id: 3,
      teacher_id: "EjytKyRwXWY07H4GSWl5VLXAA132",
      time_slot: "1300-1500",
      date: "21-01-2023",
      course_code: "MATH101",
    },
    {
      lecture_id: 4,
      teacher_id: "EjytKyRwXWY07H4GSWl5VLXAA132",
      time_slot: "1500-1700",
      date: "22-01-2023",
      course_code: "PHYS101",
    },
    {
      lecture_id: 5,
      teacher_id: "EjytKyRwXWY07H4GSWl5VLXAA132",
      time_slot: "1700-1900",
      date: "23-01-2023",
      course_code: "CHEM101",
    },
  ];
  lecture.forEach((pending) => {
    const doc = db.collection("lectures").doc();
    doc.set({
      lecture_id: doc.id,
      teacher_id: pending.teacher_id,
      time_slot: pending.time_slot,
      date: pending.date,
      course_code: pending.course_code,
    });
  });
});
router.get("/insert-data/course", (req, res) => {
  const course = [
    { course_code: "CHEM101", course_name: "Chemistry" },
    { course_code: "CSE101", course_name: "Computer Science" },
    { course_code: "CSE102", course_name: "Data Science" },
    { course_code: "MATH101", course_name: "Calculus" },
    { course_code: "PHYS101", course_name: "Physics" },
  ];
  course.forEach((pending) => {
    const doc = db.collection("courses").doc();
    doc.set(pending);
  });
});
router.get("/insert-data/lecture-student", (req, res) => {
  const course = [
    {
      stud_id: "5dysT22AIEOQmONuOEMP3IkXrFf2",
      lecture_id: "UPcqFJ31gA2JVr1Qpv65",
    },
    {
      stud_id: "5dysT22AIEOQmONuOEMP3IkXrFf2",
      lecture_id: "XtbU30QNbTDyoPEykKdZ",
    },
    {
      stud_id: "5dysT22AIEOQmONuOEMP3IkXrFf2",
      lecture_id: "g6SKclD9y7iSogkG8WAQ",
    },
    {
      stud_id: "5dysT22AIEOQmONuOEMP3IkXrFf2",
      lecture_id: "qrQCEEcW0EXug8fxJcYX",
    },
    {
      stud_id: "AS1eIIpMtuT1wRIugWl0553Am2g2",
      lecture_id: "UPcqFJ31gA2JVr1Qpv65",
    },
    {
      stud_id: "AS1eIIpMtuT1wRIugWl0553Am2g2",
      lecture_id: "f3FakbeGv7FGn1M1trsg",
    },
    {
      stud_id: "NvZnH2LlQqS48EG9XEtDEGBMY5Q2",
      lecture_id: "XtbU30QNbTDyoPEykKdZ",
    },
    {
      stud_id: "NvZnH2LlQqS48EG9XEtDEGBMY5Q2",
      lecture_id: "g6SKclD9y7iSogkG8WAQ",
    },
    {
      stud_id: "OB8thG0liQZGnLg0r3HykPyPFsa2",
      lecture_id: "f3FakbeGv7FGn1M1trsg",
    },
    {
      stud_id: "rqh89crIqhYwjmatJUtg8DfQTs02",
      lecture_id: "UPcqFJ31gA2JVr1Qpv65",
    },
    {
      stud_id: "rqh89crIqhYwjmatJUtg8DfQTs02",
      lecture_id: "XtbU30QNbTDyoPEykKdZ",
    },
  ];
  course.forEach((pending) => {
    const doc = db.collection("lecture-students").doc();
    doc.set(pending);
  });
});

//--------------------------------------------------------

//Running Server
server.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
