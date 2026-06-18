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

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

app.post(
  "/api/auth/signup",
  async (req, res) => {

    try {

      const {
        name,
        email,
        password
      } = req.body;

      const existingUser =
        await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists"
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const user =
        await User.create({
          name,
          email,
          password: hashedPassword
        });

      const token =
        jwt.sign(
          {
            userId: user._id
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d"
          }
        );

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);

app.post(
  "/api/auth/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;

      const user =
        await User.findOne({ email });

      if (!user) {

        return res.status(400).json({
          message: "Invalid credentials"
        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message: "Invalid credentials"
        });

      }

      const token =
        jwt.sign(
          {
            userId: user._id
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d"
          }
        );

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);


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