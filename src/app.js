const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1/auth", authRoutes);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API running",
  });
});

module.exports = app;