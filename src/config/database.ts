import mongoose, { Connection } from 'mongoose';

const connectDB = async (): Promise<Connection> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error connecting to MongoDB: ${errorMessage}`);
    process.exit(1);
  }
};

export default connectDB;
