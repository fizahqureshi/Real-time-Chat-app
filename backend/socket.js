// let io;

// const initSocket = (server) => {
//   io = require("socket.io")(server, {
//     cors: { origin: "*" },
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     socket.on("join", (userId) => {
//       socket.join(userId);
//       console.log("User joined room:", userId);
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// const getIO = () => {
//   if (!io) {
//     throw new Error("Socket not initialized");
//   }
//   return io;
// };

// module.exports = { initSocket, getIO };


// let io;

// // online users track karne ke liye
// const onlineUsers = new Map();

// const initSocket = (server) => {
//   io = require("socket.io")(server, {
//     cors: { origin: "*" },
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     // ===== JOIN =====
//     socket.on("join", (userId) => {
//       socket.userId = userId;
//       onlineUsers.set(userId, socket.id);
//       socket.join(userId);

//       console.log("User joined:", userId);

//       // sab ko online users list bhejo
//       io.emit("onlineUsers", Array.from(onlineUsers.keys()));
//     });

//     // ===== TYPING =====
//     socket.on("typing", ({ to }) => {
//       const receiverSocket = onlineUsers.get(to);
//       if (receiverSocket) {
//         io.to(receiverSocket).emit("typing", {
//           from: socket.userId,
//         });
//       }
//     });

//     socket.on("stopTyping", ({ to }) => {
//       const receiverSocket = onlineUsers.get(to);
//       if (receiverSocket) {
//         io.to(receiverSocket).emit("stopTyping", {
//           from: socket.userId,
//         });
//       }
//     });

//     // ===== SEEN =====
//     socket.on("seen", ({ messageId, to }) => {
//       const receiverSocket = onlineUsers.get(to);
//       if (receiverSocket) {
//         io.to(receiverSocket).emit("seen", {
//           messageId,
//           from: socket.userId,
//         });
//       }
//     });

//     // ===== DISCONNECT =====
//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);

//       if (socket.userId) {
//         onlineUsers.delete(socket.userId);
//         io.emit("onlineUsers", Array.from(onlineUsers.keys()));
//       }
//     });
//   });

//   return io;
// };

// const getIO = () => {
//   if (!io) {
//     throw new Error("Socket not initialized");
//   }
//   return io;
// };

// module.exports = { initSocket, getIO };



// let io;

// // ===== ONLINE USERS TRACK =====
// const onlineUsers = new Map();

// const initSocket = (server) => {
//   io = require("socket.io")(server, {
//     cors: { origin: "*" },
//   });

//   io.on("connection", (socket) => {

//     // ===== JOIN =====
//     socket.on("join", (userId) => {
//       socket.userId = userId;
//       onlineUsers.set(userId, socket.id);
//       socket.join(userId);

//       // broadcast online users
//       io.emit("onlineUsers", Array.from(onlineUsers.keys()));
//     });

//     // ===== TYPING =====
//     socket.on("typing", ({ to }) => {
//       const receiverSocket = onlineUsers.get(to);
//       if (receiverSocket) {
//         io.to(receiverSocket).emit("typing", {
//           from: socket.userId,
//         });
//       }
//     });

//     socket.on("stopTyping", ({ to }) => {
//       const receiverSocket = onlineUsers.get(to);
//       if (receiverSocket) {
//         io.to(receiverSocket).emit("stopTyping", {
//           from: socket.userId,
//         });
//       }
//     });

//     // ===== SEEN ✔✔ =====
//     socket.on("seen", async ({ messageId, to }) => {
//       try {
//         const Message = require("./models/Message");

//         // update DB
//         await Message.findByIdAndUpdate(messageId, {
//           seen: true,
//         });

//         const receiverSocket = onlineUsers.get(to);
//         if (receiverSocket) {
//           io.to(receiverSocket).emit("seen", {
//             messageId,
//             from: socket.userId,
//           });
//         }
//       } catch (err) {
//         console.log("Seen update failed");
//       }
//     });

//     // ===== DISCONNECT =====
//     socket.on("disconnect", () => {
//       if (socket.userId) {
//         onlineUsers.delete(socket.userId);

//         // update online list
//         io.emit("onlineUsers", Array.from(onlineUsers.keys()));
//       }
//     });
//   });

//   return io;
// };

// const getIO = () => {
//   if (!io) {
//     throw new Error("Socket not initialized");
//   }
//   return io;
// };

// module.exports = { initSocket, getIO };


let io;

// ===== ONLINE USERS TRACK =====
const onlineUsers = new Map();

const initSocket = (server) => {
  io = require("socket.io")(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // ===== JOIN =====
    socket.on("join", (userId) => {
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);
      socket.join(userId);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // ===== SEND MESSAGE (🔥 MOST IMPORTANT) =====
    socket.on("sendMessage", (message) => {
      const receiverSocket = onlineUsers.get(message.receiver);

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", message);

        // 🔔 notification event
        io.to(receiverSocket).emit("notification", {
          from: message.sender,
          text: message.text,
        });
      }
    });

    // ===== TYPING =====
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

    // ===== SEEN ✔✔ =====
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

    // ===== DISCONNECT =====
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
