import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // 1. Validation: Fail fast if the URI is missing
    if (!process.env.MONGO_URI) {
      console.error("❌ Fatal Error: MONGO_URI is not defined in .env file");
      process.exit(1);
    }

    // 2. Connection Options (Optimized for Production)
    const options = {
      // These are default in Mongoose 6+, but good to be aware of:
      // serverSelectionTimeoutMS: 5000, // Timeout after 5s if DB is unreachable
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    // 3. Startup Error Handling
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure so process managers (PM2/Docker) can restart it
    process.exit(1);
  }
};

// 4. Runtime Event Listeners (Handle disconnects while app is running)
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB Disconnected. Waiting for reconnection...");
});

mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB Runtime Error: ${err.message}`);
});

export default connectDB;