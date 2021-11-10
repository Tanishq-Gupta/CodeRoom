const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const {
    joinUser,
    getUserById,
    removeUserById,
} = require("./utils/usersHandler");

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "client")));

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", ({ userName, roomId }) => {
        const user = joinUser(socket.id, userName, roomId);
        socket.join(user.roomId);
        socket.broadcast.to(user.roomId).emit("userJoinedRoom", user.userName);
    });

    socket.on("code", (code) => {
        const user = getUserById(socket.id);
        socket.broadcast.to(user.roomId).emit("code", code);
    });
    socket.on("inputtext", (text) => {
        const user = getUserById(socket.id);
        socket.broadcast.to(user.roomId).emit("inputtext", text);
    });
    socket.on("span-details", (details) => {
        const user = getUserById(socket.id);
        socket.broadcast.to(user.roomId).emit("span-details", details);
    });
    socket.on("runStart", () => {
        const user = getUserById(socket.id);
        socket.broadcast.to(user.roomId).emit("runStart");
    });
    socket.on("runEnded", (output) => {
        const user = getUserById(socket.id);
        socket.broadcast.to(user.roomId).emit("runEnded", output);
    });
    socket.on("selectedLanguage", (selectedLanguageIndex) => {
        const user = getUserById(socket.id);
        socket.broadcast
            .to(user.roomId)
            .emit("selectedLanguage", selectedLanguageIndex);
    });
    socket.on("disconnect", () => {
        // console.log("User disconnected");
        // const removedUser = removeUserById(socket.id);
        // console.log(removedUser);
        // socket.broadcast
        //     .to(removedUser.roomId)
        //     .emit("userLeavedRoom", removedUser.userName);
    });
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
