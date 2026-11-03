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
let isConnecting = false;
let listenersAttached = false;
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

  // If already connected, return current connection
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If already in the process of connecting, don't create concurrent connections
  if (mongoose.connection.readyState === 2 || isConnecting) {
    return null;
  }

  // Attach event listeners exactly once to avoid listener leaks
  if (!listenersAttached) {
    listenersAttached = true;

    mongoose.connection.on('error', (err) => {
      console.error('❌ [MongoDB Runtime Error]:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  [MongoDB Disconnected]: Lost connection to Atlas database.');
      if (!reconnectTimeout && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        reconnectTimeout = setTimeout(() => {
          reconnectTimeout = null;
          connectDB();
        }, 5000);
      }
    });
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });

    reconnectAttempts = 0;
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    console.log(`✅ [MongoDB Atlas Connected]: ${mongoose.connection.host || 'connected'} (DB: ${mongoose.connection.name || 'poona_pools'})`);
    return conn;
  } catch (error) {
    reconnectAttempts++;
    console.error(`❌ [MongoDB Connection Error (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})]:`, error.message);

    // Auto-retry connection up to MAX_RECONNECT_ATTEMPTS times
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      if (!reconnectTimeout) {
        reconnectTimeout = setTimeout(() => {
          reconnectTimeout = null;
          connectDB();
        }, 8000);
      }
    } else {
      console.warn('ℹ️  [MongoDB Notice]: Paused automatic retries.');
    }
    return null;
  } finally {
    isConnecting = false;
  }
}
