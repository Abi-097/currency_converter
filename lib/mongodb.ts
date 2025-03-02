import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://abishekraja84:xvDiIzLuUVEk3N34@curr.xnpx6.mongodb.net/?retryWrites=true&w=majority&appName=curr';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define the type for our cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global type with our mongoose property
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize the cached connection
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Store the connection in the global object
if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;