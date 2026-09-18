import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (mongoUri && mongoUri !== 'mongodb://localhost:27017/manmeet-creations') {
      try {
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`✅ External MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.log('⚠️ External MongoDB URI connection failed, falling back to embedded MongoDB...');
      }
    }

    // Try standard local MongoDB
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manmeet_creations', {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (localErr) {
      console.log('ℹ️ Local MongoDB daemon not running. Launching built-in fast in-memory MongoDB engine...');
    }

    // Fallback to MongoMemoryServer for instant 100% reliable execution
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`✅ Fast In-Memory MongoDB Engine Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
