const mysql = require("mysql");
const auth = require("firebase-admin/auth");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const connection = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  database: "antiproxyDB",
});
const createTableIfNotExists = (tableName, query) => {
  connection.query(
    `CREATE TABLE IF NOT EXISTS ${tableName} ${query}`,
    function (err, results) {
      if (err) {
        console.error(err);
      } else {
        console.log(`Table ${tableName} created successfully`);
      }
    }
  );
};
connection.connect((err) => {
  if (err) {
    console.log(err);
  }

  // create the 'course' table
  createTableIfNotExists(
    "courses",
    `(
    course_code VARCHAR(255) PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL
  )`
  );

  // create the 'lecture' table
  createTableIfNotExists(
    "lectures",
    `(
    lecture_id INT PRIMARY KEY,
    teacher_id VARCHAR(255) NOT NULL,
    time_slot VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    course_code VARCHAR(255),
    FOREIGN KEY (course_code) REFERENCES courses(course_code),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
  )`
  );

  // create the 'student' table
  createTableIfNotExists(
    "students",
    `(
    stud_id VARCHAR(255) PRIMARY KEY,
    reg_no VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )`
  );

  createTableIfNotExists(
    "lecture_students",
    `(
    stud_id VARCHAR(255),
    lecture_id INT,
    PRIMARY KEY (stud_id, lecture_id),
    FOREIGN KEY (stud_id) REFERENCES students(stud_id),
    FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id)
  )`
  );

  createTableIfNotExists(
    "Qr",
    `(
    id INT AUTO_INCREMENT PRIMARY KEY,
    lecture_id INT NOT NULL,
    qr_code VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id)
    )`
  );

  createTableIfNotExists(
    "todos",
    `(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    task VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL
  );`
  );
});

module.exports = { connection, db, auth };
