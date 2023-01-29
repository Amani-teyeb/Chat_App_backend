const express = require("express");
const app = express();
const env = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../src/config/connectDB");
const path = require("path");

env.config();
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const { Socket } = require("socket.io");

mongoose.set("strictQuery", false);
connectDB();

app.use("/api", authRoutes);
app.use("/api", chatRoutes);
app.use("/api", messageRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
