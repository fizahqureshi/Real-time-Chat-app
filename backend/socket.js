let io;

// online users tracking
const onlineUsers = new Map();

const initSocket = (server) => {
  io = require("socket.io")(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);
      socket.join(userId);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // send message
    socket.on("sendMessage", (message) => {
      const receiverSocket = onlineUsers.get(message.receiver);

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", message);

        //  notification event
        io.to(receiverSocket).emit("notification", {
          from: message.sender,
          text: message.text,
        });
      }
    });
// jab user typing kar raha ho
    socket.on("typing", ({ to }) => {
      const receiverSocket = onlineUsers.get(to);
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", {
          from: socket.userId,
        });
      }
    });

    socket.on("stopTyping", ({ to }) => {
      const receiverSocket = onlineUsers.get(to);
      if (receiverSocket) {
        io.to(receiverSocket).emit("stopTyping", {
          from: socket.userId,
        });
      }
    });

    // seen
    socket.on("seen", async ({ messageId, to }) => {
      try {
        const Message = require("./models/Message");

        await Message.findByIdAndUpdate(messageId, {
          seen: true,
        });

        const receiverSocket = onlineUsers.get(to);
        if (receiverSocket) {
          io.to(receiverSocket).emit("seen", {
            messageId,
            from: socket.userId,
          });
        }
      } catch (err) {
        console.log("Seen update failed");
      }
    });

    // offline
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };
