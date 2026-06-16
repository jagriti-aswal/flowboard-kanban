const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let tasks = [];

io.on("connection", (socket) => {
    socket.on(
    "task:move",
    ({ taskId, newStatus }) => {

        tasks = tasks.map(task =>
        task.id === taskId
            ? {
                ...task,
                status: newStatus,
                updatedAt: new Date().toISOString()
            }
            : task
        );

        io.emit(
        "sync:tasks",
        tasks
        );

    }
    );
    socket.on(
  "task:update",
    ({ id, data }) => {

        tasks = tasks.map(task =>
        task.id === id
            ? {
                ...task,
                ...data,
                updatedAt: new Date().toISOString()
            }
            : task
        );

        io.emit(
        "sync:tasks",
        tasks
        );

    }
    );
    socket.on(
  "task:delete",
    (id) => {

        tasks = tasks.filter(
        task => task.id !== id
        );

        io.emit(
        "sync:tasks",
        tasks
        );

    }
    );
  console.log("User connected");

  // Jab koi naya user aaye
  socket.emit("sync:tasks", tasks);

  // Create Task
  socket.on("task:create", (task) => {
    tasks.push(task);

    io.emit("sync:tasks", tasks);
  });

  // Delete Task
  socket.on("task:delete", (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);

    io.emit("sync:tasks", tasks);
  });

  console.log("Socket events registered");
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});