import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String, // like, comment, follow
  message: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
