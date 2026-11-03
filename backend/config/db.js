/**
 * ==============================================================================
 * DATABASE CONNECTION MODULE (MongoDB Atlas via Mongoose)
 * ==============================================================================
 * Student / Developer Guide:
 * Manages resilient connection to MongoDB Atlas with auto-reconnection on network drop.
 * ==============================================================================
 */

import mongoose from 'mongoose';

let reconnectTimeout = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 6;

/**
 * Establishes a connection to MongoDB Atlas.
 * @returns {Promise<typeof mongoose>} Mongoose connection instance
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  // Validation: Check if the connection string exists
  if (!uri || uri.includes('<db_username>') || uri.includes('<db_password>')) {
    console.warn(
      '\n⚠️  [MongoDB Warning]: MONGODB_URI is not configured with real Atlas credentials in backend/.env.'
    );
    console.warn(
      '👉  Please set your actual MongoDB Atlas connection string in backend/.env to connect to the database.\n'
    );
    return null;
  }

  // If already connected or connecting, return current connection
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    // Attempt connection to MongoDB Atlas
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000 // Timeout after 10s if Atlas is unreachable
    });

    reconnectAttempts = 0;
    console.log(`✅ [MongoDB Atlas Connected]: ${conn.connection.host} (DB: ${conn.connection.name})`);

    // Listen for unexpected connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('❌ [MongoDB Runtime Error]:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  [MongoDB Disconnected]: Lost connection to Atlas database. Retrying in 5 seconds...');
      if (!reconnectTimeout && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        reconnectTimeout = setTimeout(() => {
          reconnectTimeout = null;
          connectDB();
        }, 5000);
      }
    });

    return conn;
  } catch (error) {
    reconnectAttempts++;
    console.error(`❌ [MongoDB Connection Error (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})]:`, error.message);
    console.error('👉  ACTION: In MongoDB Atlas -> Network Access -> Add IP Address -> Choose "Allow Access From Anywhere" (0.0.0.0/0).');

    // Auto-retry connection up to MAX_RECONNECT_ATTEMPTS times
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      if (!reconnectTimeout) {
        reconnectTimeout = setTimeout(() => {
          reconnectTimeout = null;
          connectDB();
        }, 10000);
      }
    } else {
      console.warn('ℹ️  [MongoDB Notice]: Paused automatic retries. Visit http://localhost:5000/api/health or restart when your IP is whitelisted in Atlas.');
    }
    return null;
  }
}
