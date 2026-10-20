
const express = require("express");
const Letter = require("../models/Letter");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect every route in this file
router.use(authMiddleware);

// Create a letter belonging to the logged-in user
router.post("/", async (req, res) => {
  try {
    const {
      title,
      message,
      recipientEmail,
      paper,
      font,
      decoration,
      deliveryDate,
      status
    } = req.body;

    if (
      typeof title !== "string" ||
      typeof message !== "string" ||
      typeof recipientEmail !== "string" ||
      !title.trim() ||
      !message.trim() ||
      !recipientEmail.trim()
    ) {
      return res.status(400).json({
        message: "Title, message, and recipient email are required."
      });
    }

    if (
      title.trim().length > 150 ||
      message.length > 20000 ||
      recipientEmail.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())
    ) {
      return res.status(400).json({
        message: "Please check your letter details and try again."
      });
    }

    const letter = await Letter.create({
      userId: req.userId,
      title: title.trim(),
      message,
      recipientEmail: recipientEmail.trim().toLowerCase(),
      paper,
      font,
      decoration,
      deliveryDate: deliveryDate || null,
      status: status === "scheduled" ? "scheduled" : "draft"
    });

    return res.status(201).json({
      message: "Letter saved successfully! 💌",
      letter
    });
  } catch (error) {
    console.error("Save letter error:", error.message);

    return res.status(500).json({
      message: "Could not save the letter."
    });
  }
});

// Get only the logged-in user's letters
router.get("/", async (req, res) => {
  try {
    const letters = await Letter.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    return res.json(letters);
  } catch (error) {
    console.error("Fetch letters error:", error.message);

    return res.status(500).json({
      message: "Could not fetch letters."
    });
  }
});

module.exports = router;
