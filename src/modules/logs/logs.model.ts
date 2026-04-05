import mongoose, { InferSchemaType } from "mongoose";

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: true,
      enum: ["info", "warn", "error"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    context: {
      type: String,
      default: "application",
      trim: true,
    },
    method: {
      type: String,
      trim: true,
    },
    route: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    statusCode: {
      type: Number,
    },
    durationMs: {
      type: Number,
    },
    requestId: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    stack: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  },
);

export type LogDocument = InferSchemaType<typeof logSchema>;

export const LogModel =
  mongoose.models.Log || mongoose.model("Log", logSchema);
