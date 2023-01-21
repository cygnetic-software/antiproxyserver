const express = require("express");
const cors = require("cors");

const teacherRouter = require("./routes/RegisterTeacher/register-teacher.route");
const teacherActionRouter = require("./routes/TeacherAction/teacher-action.route");
const addStudentRouter = require("./routes/AddNewStudent/add-student.route");
const authAdminRouter = require("./routes/AuthenticateAdmin/auth-admin.route");
const authTeacherRouter = require("./routes/AuthenticateTeacher/auth-teacher.route");
const authStudentRouter = require("./routes/AuthenticateStudent/auth-student.route");
const retrieveTeacherLecturesRouter = require("./routes/RetrieveLectures/retrieve-lecture.route");
const startDigitalClassRouter = require("./routes/DigitalClass/start-digital-class.route");
const stopDigitalClassRouter = require("./routes/DigitalClass/stop-digital-class.route");

// PORT
const PORT = 8000;

// Initializing Server
const app = express();
const router = express.Router();

// Middlewares
app.use(express.json());
app.use(cors());

//Routers
router.use("/register-new-teacher", teacherRouter);
router.use("/teacher-action", teacherActionRouter);
router.use("/add-new-student", addStudentRouter);
router.use("/auth-admin", authAdminRouter);
router.use("/auth-teacher", authTeacherRouter);
router.use("/auth-student", authStudentRouter);
router.use("/lectures", retrieveTeacherLecturesRouter);

router.use("/start-digital-class", startDigitalClassRouter);
router.use("/stop-digital-class", stopDigitalClassRouter);

// UseRoutes
app.use("/", router);
//Running Server
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
