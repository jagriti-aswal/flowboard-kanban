require("dotenv").config();

const mongoose = require("mongoose");
const Task = require("./models/Task");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const emitAllTasks = async () => {
  const allTasks = await Task.find();

  return allTasks.map((task) => ({
    ...task.toObject(),
    id: task._id.toString(),
  }));
};

io.on("connection", async (socket) => {
  console.log("User connected");

  try {
    const tasks = await emitAllTasks();

    socket.emit(
      "sync:tasks",
      tasks
    );
  } catch (err) {
    console.error("Initial Load Error:", err);
  }

  // CREATE TASK
  socket.on("task:create", async (taskData) => {
    try {
      await Task.create(taskData);

      const tasks = await emitAllTasks();

      io.emit(
        "sync:tasks",
        tasks
      );

    } catch (err) {
      console.error("Create Task Error:", err);
    }
  });

  // MOVE TASK
  socket.on(
    "task:move",
    async ({ taskId, newStatus }) => {
      try {

        await Task.findByIdAndUpdate(
          taskId,
          {
            status: newStatus,
          }
        );

        const tasks = await emitAllTasks();

        io.emit(
          "sync:tasks",
          tasks
        );

      } catch (err) {
        console.error("Move Task Error:", err);
      }
    }
  );

  // DELETE TASK
  socket.on(
    "task:delete",
    async (taskId) => {
      try {

        await Task.findByIdAndDelete(
          taskId
        );

        const tasks = await emitAllTasks();

        io.emit(
          "sync:tasks",
          tasks
        );

      } catch (err) {
        console.error("Delete Task Error:", err);
      }
    }
  );

  // UPDATE TASK
  socket.on(
    "task:update",
    async ({ id, data }) => {
      try {

        await Task.findByIdAndUpdate(
          id,
          data
        );

        const tasks = await emitAllTasks();

        io.emit(
          "sync:tasks",
          tasks
        );

      } catch (err) {
        console.error("Update Task Error:", err);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  console.log("Socket events registered");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

server.listen(5000, () => {
  console.log("Server running on port 5000");
});