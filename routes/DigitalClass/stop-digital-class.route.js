const express = require("express");
const router = express.Router();
const { connection, io, classData } = require("../../settings/setting");

router.post("/:lectureId", (req, res) => {
  const lecture_id = req.params.lectureId;
  const roomId = `class-${lecture_id}`;

  // Emit an event to all connected clients in the room, informing them that the class has ended
  io.to(roomId).emit("classEnded");

  // Remove the room data for the specific lecture
  delete classData[roomId];

  // Inform the clients that the class has ended
  res.status(200).json({ msg: "Class Ended" });
});

module.exports = router;
