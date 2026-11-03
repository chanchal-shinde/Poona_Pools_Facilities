/**
 * ==============================================================================
 * POONA POOLS FACILITIES - EXPRESS SERVER ENTRY POINT (Phase 1)
 * ==============================================================================
 * Student / Developer Guide:
 * This is the central entry point for the backend REST API server.
 * 
 * In this Phase 1:
 * 1. Loads environment variables from backend/.env using dotenv.
 * 2. Connects to MongoDB Atlas via Mongoose.
 * 3. Configures CORS with credentials for React frontend communication.
 * 4. Enables JSON body parsing and cookie-parser for incoming requests.
 * 5. Provides a /api/health endpoint to verify server and database connectivity.
 * ==============================================================================
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load environment variables from backend/.env file reliably
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Trust reverse proxy headers (essential on Render / Heroku / AWS behind SSL reverse proxy)
app.set('trust proxy', 1);

// 2. Establish connection to MongoDB Atlas
connectDB();

// 3. Configure CORS (Cross-Origin Resource Sharing)
// Parse FRONTEND_URL (supports comma-separated list and strips trailing slashes)
const configuredOrigins = FRONTEND_URL.split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...configuredOrigins
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, server-to-server, curl, health probes)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, '');

      // Check configured origins
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      // In production, also allow Vercel preview deployments (*.vercel.app)
      if (NODE_ENV === 'production' && /^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(cleanOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true // Crucial for sending/receiving HttpOnly cookies
  })
);

// 4. Request Parsers
// Parses incoming requests with application/json payloads
app.use(express.json());

// Parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// Parses cookies attached to incoming requests (for JWT authentication)
app.use(cookieParser());

// ==============================================================================
// BASE & HEALTH-CHECK ROUTES
// ==============================================================================

/**
 * Root Welcome Route
 * Confirms the API is online when visited in a browser
 */
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Poona Pools Facilities API',
    status: 'Running',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

/**
 * Health-Check Endpoint
 * GET /api/health
 * 
 * Verifies:
 * - Express server is healthy and responding
 * - Real-time MongoDB Atlas connection status
 * - Current server uptime and runtime environment
 */
app.get('/api/health', (req, res) => {
  // mongoose.connection.readyState states:
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;

  // Proactively attempt re-connection if currently disconnected
  if (dbState === 0) {
    connectDB().catch(() => {});
  }

  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'healthy' : 'degraded',
    message: isDbConnected
      ? 'Express server and MongoDB Atlas connection are operational.'
      : 'Express server is running, but MongoDB Atlas is not yet connected.',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: NODE_ENV,
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      connected: isDbConnected,
      host: mongoose.connection.host || 'none',
      name: mongoose.connection.name || 'none'
    }
  });
});

// ==============================================================================
// APPLICATION ROUTES
// ==============================================================================

// Authentication Routes: /api/auth/login, /api/auth/logout, /api/auth/me
app.use('/api/auth', authRoutes);

// Public Customer Routes: /api/public/services
app.use('/api/public', publicRoutes);

// Public Feedback Routes: /api/feedback (POST submit, GET approved)
app.use('/api/feedback', feedbackRoutes);

// Protected Admin Routes: /api/admin/services
app.use('/api/admin', adminRoutes);

// ==============================================================================
// ERROR HANDLING MIDDLEWARE
// ==============================================================================

// 404 Route Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Central Internal Error Handler
app.use((err, req, res, _next) => {
  console.error('❌ [Unhandled Server Error]:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error. Please try again later.'
  });
});

// ==============================================================================
// START SERVER LISTENER
// ==============================================================================
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Poona Pools API Server Running on port ${PORT}`);
  console.log(`📡 Health Check URL : http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment      : ${NODE_ENV}`);
  console.log(`🔒 Allowed Origin   : ${FRONTEND_URL}`);
  console.log(`==================================================\n`);
});

