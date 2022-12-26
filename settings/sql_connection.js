const mysql = require("mysql");

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

module.exports = connection;
