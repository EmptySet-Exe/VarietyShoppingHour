// Managing middleware and routes

// Initial setup for auth and loading environment variables
// Using Mongoose for MongoDB
// backend/index.js

// require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

// console.log('Using username:', (process.env.MONGODB_URI || '').split('://')[1]?.split(':')[0]);



const path = require('path');
const fs = require('fs');
const candidates = [
  path.join(__dirname, '.env'),        // /backend/.env
  path.join(__dirname, '..', '.env'),  // project-root/.env
];
let loaded = false;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    require('dotenv').config({ path: p });
    console.log('Loaded .env from:', p);
    loaded = true;
    break;
  }
}
if (!loaded) {
  console.error('No .env file found at:', candidates.join(' or '));
}

// TEMP sanity logs (remove after it works)
console.log('MONGODB_URI present?', !!process.env.MONGODB_URI);
console.log('MONGODB_DB:', process.env.MONGODB_DB);

// AFTER the robust .env loader block
const uri = process.env.MONGODB_URI || '';
const parsedUser = uri.split('://')[1]?.split('@')[0]?.split(':')[0];
console.log('MONGODB_URI present?', !!process.env.MONGODB_URI);
console.log('Username from URI:', parsedUser);
console.log('MONGODB_DB:', process.env.MONGODB_DB);




// Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('../middleware/logger')
const errorHandler = require('../middleware/errorHandler')
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

let authRoutes;
try {
  authRoutes = require('./routes/auth_routes');
} catch {
  console.warn('./routes/auth_routes not found yet — skipping');
}

const app = express();

// Core middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health + base
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.get('/', (_req, res) => res.send('Successfully called the web server'));

// Routes
if (authRoutes) {
  app.use('/auth', rateLimit({ windowMs: 60_000, max: 60 }), authRoutes);
}

// 404 + error handler (keep after routes)
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;



async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const server = app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down...');
      await mongoose.connection.close(false);
      server.close(() => process.exit(0));
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Mongo connect error:', err.message);
    process.exit(1);
  }
}

app.use(errorHandler)
connectDB();
