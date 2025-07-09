import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://putrarifki705:kblim@cardifyai.smnxv8y.mongodb.net/ecoterra-database?retryWrites=true&w=majority&appName=CardifyAi';
    
    const conn = await mongoose.connect(mongoURI, {
      // MongoDB Atlas optimizations
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'), // Maximum number of connections in the connection pool
      minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),  // Minimum number of connections in the connection pool
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('🟢 MongoDB Atlas connection established');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔴 MongoDB Atlas disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Atlas connection error:', err);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🟡 MongoDB Atlas reconnected');
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
