const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const { initSocket, getIO } = require("./socket");

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
initSocket(server);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log("Server + Socket running on port", PORT);
});
