const express = require("express");
const router = express.Router();
const { connection, auth } = require("../../settings/setting");

router.get("/", (req, res) => {
  connection.query(`SELECT * FROM todos;`, function (err, results, fields) {
    if (err) {
      res.status(500).json({ msg: err });
    }
    res.status(201).json({ msg: results });
  });
});
router.post("/", (req, res) => {
  const { title, task } = req.body;
  connection.query(
    `INSERT INTO todos (title, task, date) VALUES (?, ?, ?);`,
    [title, task, Date.now()],
    function (err, results, fields) {
      if (err) {
        console.error(err.message);
      }
      connection.query(`SELECT * FROM todos;`, function (err, results, fields) {
        if (err) {
          res.status(500).json({ msg: err });
        }
        res.status(201).json({ msg: results });
      });
    }
  );
});
router.put("/:todoId", (req, res) => {
  const { title, task } = req.body;

  connection.query(
    `UPDATE todos set title = '${title}', task = '${task}'  WHERE id = ${req.params.todoId};`,

    function (err, results, fields) {
      if (err) {
        console.error(err.message);
      }
      connection.query(`SELECT * FROM todos;`, function (err, results, fields) {
        if (err) {
          res.status(500).json({ msg: err });
        }
        res.status(201).json({ msg: results });
      });
    }
  );
});
router.delete("/:todoId", (req, res) => {
  connection.query(
    `DELETE FROM todos WHERE id = ${req.params.todoId};`,

    function (err, results, fields) {
      if (err) {
        console.error(err.message);
      }
      connection.query(`SELECT * FROM todos;`, function (err, results, fields) {
        if (err) {
          res.status(500).json({ msg: err });
        }
        res.status(201).json({ msg: results });
      });
    }
  );
});

module.exports = router;
