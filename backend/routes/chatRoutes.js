// const express = require("express");
// const Message = require("../models/Message");
// const auth = require("../middleware/authMiddleware");

// const router = express.Router();

// // SEND MESSAGE
// router.post("/send", auth, async (req, res) => {
//   const { receiverId, text } = req.body;

//   if (!receiverId || !text)
//     return res.status(400).json({ message: "All fields required" });

//   try {
//     const message = await Message.create({
//       sender: req.user.id,
//       receiver: receiverId,
//       text,
//     });

//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET CHAT BETWEEN TWO USERS
// router.get("/:userId", auth, async (req, res) => {
//   const messages = await Message.find({
//     $or: [
//       { sender: req.user.id, receiver: req.params.userId },
//       { sender: req.params.userId, receiver: req.user.id },
//     ],
//   }).sort({ createdAt: 1 });

//   res.json(messages);
// });

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authMiddleware");
// const Message = require("../models/Message");

// // SEND MESSAGE
// router.post("/send", auth, async (req, res) => {
//   const { receiverId, text } = req.body;

//   if (!receiverId || !text) {
//     return res.status(400).json({ message: "All fields required" });
//   }

//   try {
//     const message = await Message.create({
//       sender: req.user._id,
//       receiver: receiverId,
//       text,
//     });

//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authMiddleware");
// const Message = require("../models/Message");
// router.post("/send", authMiddleware, async (req, res) => {
//   try {
//     const senderId = req.user.id;      // JWT se
//     const { receiverId, text } = req.body;

//     if (!receiverId || !text) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     if (senderId === receiverId) {
//       return res.status(400).json({
//         message: "You cannot send message to yourself",
//       });
//     }

//     const message = await Message.create({
//       sender: senderId,
//       receiver: receiverId,
//       text,
//     });

//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });



// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");
// const Message = require("../models/Message");

// router.post("/send", authMiddleware, async (req, res) => {
//   try {
//     const senderId = req.user._id.toString();
//     const { receiverId, text } = req.body;

//     if (!receiverId || !text) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     if (senderId === receiverId) {
//       return res
//         .status(400)
//         .json({ message: "You cannot send message to yourself" });
//     }

//     const message = await Message.create({
//       sender: senderId,
//       receiver: receiverId,
//       text,
//       delivered: true,
//     });

//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET CHAT BETWEEN TWO USERS
// router.get("/:userId", authMiddleware, async (req, res) => {
//   try {
//     const currentUserId = req.user._id.toString();
//     const otherUserId = req.params.userId;

//     // ✅ Jab user chat open kare → seen true
//     await Message.updateMany(
//       {
//         sender: otherUserId,
//         receiver: currentUserId,
//         seen: false,
//       },
//       { seen: true }
//     );

//     const messages = await Message.find({
//       $or: [
//         { sender: currentUserId, receiver: otherUserId },
//         { sender: otherUserId, receiver: currentUserId },
//       ],
//     }).sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");
// const Message = require("../models/Message");
// const { getIO } = require("../socket"); // ✅ socket access

// // ================= SEND MESSAGE =================
// router.post("/send", authMiddleware, async (req, res) => {
//   try {
//     const senderId = req.user._id.toString();
//     const { receiverId, text } = req.body;

//     if (!receiverId || !text) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     if (senderId === receiverId) {
//       return res
//         .status(400)
//         .json({ message: "You cannot send message to yourself" });
//     }

//     const message = await Message.create({
//       sender: senderId,
//       receiver: receiverId,
//       text,
//       delivered: true, // ✔ single tick
//       seen: false,
//     });

//     // 🔔 real-time message
//     const io = getIO();
//     io.to(receiverId).emit("newMessage", message);

//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ================= DELETE CHAT =================
// router.delete("/delete/:userId", authMiddleware, async (req, res) => {
//   try {
//     const currentUserId = req.user._id.toString();
//     const otherUserId = req.params.userId;

//     await Message.deleteMany({
//       $or: [
//         { sender: currentUserId, receiver: otherUserId },
//         { sender: otherUserId, receiver: currentUserId },
//       ],
//     });

//     res.json({ message: "Chat deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ================= GET CHAT =================
// router.get("/:userId", authMiddleware, async (req, res) => {
//   try {
//     const currentUserId = req.user._id.toString();
//     const otherUserId = req.params.userId;

//     // ✔✔ seen update
//     await Message.updateMany(
//       {
//         sender: otherUserId,
//         receiver: currentUserId,
//         seen: false,
//       },
//       { seen: true }
//     );

//     // ✔✔ sender ko notify
//     const io = getIO();
//     io.to(otherUserId).emit("seen", {
//       from: currentUserId,
//     });

//     const messages = await Message.find({
//       $or: [
//         { sender: currentUserId, receiver: otherUserId },
//         { sender: otherUserId, receiver: currentUserId },
//       ],
//     }).sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");

// ================= SEND MESSAGE =================
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const senderId = req.user._id.toString();
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ message: "You cannot send message to yourself" });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
      delivered: true, // ✔ single tick
      seen: false,
    });

    // ❌ yahan socket emit nahi hoga
    // socket.js handle karega realtime

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DELETE CHAT =================
router.delete("/delete/:userId", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const otherUserId = req.params.userId;

    await Message.deleteMany({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    });

    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET CHAT =================
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const otherUserId = req.params.userId;

    // ✔✔ seen update
    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        seen: false,
      },
      { seen: true }
    );

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
