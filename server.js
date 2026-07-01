require("dotenv").config();

console.log("1. dotenv loaded");

const app = require("./src/app");
console.log("2. app loaded");

const connectDB = require("./src/config/db");
console.log("3. db function loaded");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("4. connecting to DB...");
    await connectDB();
    console.log("5. DB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
  }
};

startServer();