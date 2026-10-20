
const mongoose = require("mongoose");

const letterSchema = new mongoose.Schema(
  {
        userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    message: {
      type: String,
      required: true,
      maxlength: 20000
    },
    recipientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    paper: {
      type: String,
      enum: ["Ivory", "Rose", "Sage", "Lilac"],
      default: "Ivory"
    },
    font: {
      type: String,
      enum: ["Caveat", "Playfair Display", "DM Sans"],
      default: "Caveat"
    },
    decoration: {
      type: String,
      default: "♡"
    },
    deliveryDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "sent", "failed"],
      default: "draft"
    },
    sentAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Letter", letterSchema);
