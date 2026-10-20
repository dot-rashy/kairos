
require("dotenv").config();
const authRouter = require("./routes/auth");
const lettersRouter = require("./routes/letters");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/letters", lettersRouter);

app.get("/", (req, res) => {
  res.json({
    message: "KAIROS backend is running! 💌",
    database: mongoose.connection.readyState === 1
      ? "Connected"
      : "Disconnected"
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected successfully! 💚");

    app.listen(PORT, () => {
      console.log(`KAIROS server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
