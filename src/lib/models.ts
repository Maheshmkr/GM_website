/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema } from "mongoose";

// Define Photo schema
const PhotoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileId: { type: Schema.Types.ObjectId, required: true }, // GridFS file ID
    category: { type: String, default: "Favorites" },
    favorite: { type: Boolean, default: false },
    showInHero: { type: Boolean, default: false }, // Show on home screen hero
  },
  { timestamps: true },
);

// Define Video schema
const VideoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileId: { type: Schema.Types.ObjectId, required: true }, // GridFS file ID
    favorite: { type: Boolean, default: false },
    duration: { type: String, default: "0:30" },
  },
  { timestamps: true },
);

// Define Song schema
const SongSchema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    description: { type: String },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileId: { type: Schema.Types.ObjectId, required: true }, // GridFS audio file ID
    coverFileId: { type: Schema.Types.ObjectId }, // GridFS cover image file ID (optional)
    duration: { type: String, default: "3:00" },
  },
  { timestamps: true },
);

// Define Timeline schema
const TimelineSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true }, // Custom string (e.g. "12 May 2024" or "Forever")
    memoryDate: { type: String }, // User manually selected date (YYYY-MM-DD)
    location: { type: String },
    imageFileId: { type: Schema.Types.ObjectId }, // GridFS photo ID
    videoFileId: { type: Schema.Types.ObjectId }, // GridFS video ID
    icon: {
      type: String,
      enum: ["heart", "coffee", "sparkles", "plane", "star"],
      default: "heart",
    },
    highlight: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Avoid model recompilation on hot reload
export const Photo = mongoose.models.Photo || mongoose.model("Photo", PhotoSchema, "photos");
export const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema, "videos");
export const Song = mongoose.models.Song || mongoose.model("Song", SongSchema, "songs");
export const Timeline =
  mongoose.models.Timeline || mongoose.model("Timeline", TimelineSchema, "timelines");

// Define MediaItem schema
const MediaItemSchema = new Schema(
  {
    type: { type: String, enum: ["image", "video", "song"], required: true },
    source: { type: String, enum: ["upload", "url", "spotify", "google-drive"], required: true },
    title: { type: String, required: true },
    artist: { type: String }, // For songs
    filename: { type: String }, // For uploaded files
    mimeType: { type: String }, // For uploaded files
    fileSize: { type: Number }, // For uploaded files
    fileId: { type: Schema.Types.ObjectId }, // GridFS file ID for uploaded files
    url: { type: String }, // For URL-based songs
    category: { type: String, default: "Favorites" }, // For photo categories
    favorite: { type: Boolean, default: false }, // For photo/video favorite highlights
    showInHero: { type: Boolean, default: false }, // Show on home screen hero
    memoryDate: { type: String }, // User manually selected date (YYYY-MM-DD)
    description: { type: String }, // For description
    duration: { type: String }, // For songs/videos duration
    coverFileId: { type: Schema.Types.ObjectId }, // GridFS cover image file ID (optional)
    startTime: { type: String }, // Starting playback timestamp e.g. "4:28"
    startSeconds: { type: Number }, // Starting playback in seconds e.g. 268
    endTime: { type: String }, // Ending playback timestamp e.g. "5:49"
    endSeconds: { type: Number }, // Ending playback in seconds e.g. 349
  },
  { timestamps: true },
);

export const MediaItem =
  mongoose.models.MediaItem || mongoose.model("MediaItem", MediaItemSchema, "mediaItems");

const UploadChunkSchema = new Schema(
  {
    uploadId: { type: String, required: true },
    chunkIndex: { type: Number, required: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    type: { type: String, enum: ["image", "video", "song"], required: true },
    data: { type: Buffer, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "uploadChunks" },
);

export const UploadChunk =
  mongoose.models.UploadChunk || mongoose.model("UploadChunk", UploadChunkSchema, "uploadChunks");

// Define User schema
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // Hashed password (SHA-256)
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema, "users");

// Define FunZoneStage schema
const FunZoneStageSchema = new Schema(
  {
    stage: { type: Number, required: true, unique: true, min: 1, max: 5 },
    title: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileId: { type: Schema.Types.ObjectId, required: true }, // GridFS file ID
  },
  { timestamps: true }
);

export const FunZoneStage =
  mongoose.models.FunZoneStage ||
  mongoose.model("FunZoneStage", FunZoneStageSchema, "funZoneStages");

// Define Letter schema
const LetterSchema = new Schema(
  {
    title: { type: String, required: true },
    preview: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String, default: "Love" },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Letter =
  mongoose.models.Letter || mongoose.model("Letter", LetterSchema, "letters");


