import dns from 'node:dns';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Configure reliable DNS servers for Node.js SRV resolution on Windows
try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch {
  // Ignore DNS config errors
}

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (mongoUri && mongoUri.trim() !== '') {
      try {
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 10000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.warn(`⚠️ Primary MongoDB connection failed (${err.message}), attempting fallback...`);
      }
    }

    // Try standard local MongoDB
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manmeet_creations', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (localErr) {
      console.log('ℹ️ Local MongoDB daemon not running. Launching built-in fast in-memory MongoDB engine...');
    }

    // Fallback to MongoMemoryServer for offline development
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`✅ Fast In-Memory MongoDB Engine Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
