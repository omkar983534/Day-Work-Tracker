require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Connect to the database
connectDB();

const app = express();

// ----- Middleware -----
app.use(express.json()); // parse JSON request bodies
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ----- Health check -----
app.get("/", (req, res) => {
  res.json({ message: "MERN To-Do API is running 🚀" });
});

// ----- Routes -----
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ----- 404 handler -----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----- Central error handler -----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
