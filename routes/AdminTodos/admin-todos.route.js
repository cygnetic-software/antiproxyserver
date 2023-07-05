const express = require("express");
const router = express.Router();
const { db } = require("../../settings/setting");

const getAllTodos = async () => {
  const snapshot = await db.collection("todos").get();
  let results = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();
    results.push({ id, ...data });
  });
  return results;
};

router.get("/", async (req, res) => {
  try {
    const todos = await getAllTodos();
    res.status(200).json({ msg: todos });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/", async (req, res) => {
  const { title, task } = req.body;
  try {
    await db.collection("todos").add({
      title: title,
      task: task,
      date: Date.now(),
    });
    const todos = await getAllTodos();
    res.status(200).json({ msg: todos });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message });
  }
});

router.put("/:todoId", async (req, res) => {
  const { title, task } = req.body;
  const { todoId } = req.params;
  try {
    await db.collection("todos").doc(todoId).update({
      title: title,
      task: task,
    });
    const todos = await getAllTodos();
    res.status(200).json({ msg: todos });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/:todoId", async (req, res) => {
  const { todoId } = req.params;
  try {
    await db.collection("todos").doc(todoId).delete();
    const todos = await getAllTodos();
    res.status(200).json({ msg: todos });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
