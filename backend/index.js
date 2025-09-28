// backend/index.js

// 0) Robust .env loader
const path = require('path');
const fs = require('fs');
const candidates = [path.join(__dirname, '.env'), path.join(__dirname, '..', '.env')];
for (const p of candidates) {
  if (fs.existsSync(p)) {
    require('dotenv').config({ path: p });
    console.log('Loaded .env from:', p);
    break;
  }
}
console.log('MONGODB_URI present?', !!process.env.MONGODB_URI);
console.log('MONGODB_DB:', process.env.MONGODB_DB);

// 1) Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// custom middleware (paths are relative to /backend)
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// routes (filename must match exactly)
const authRoutes = require('./routes/authRoutes'); // <-- you said this is the name

// 2) App + core middleware
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// 3) Health & base
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.get('/', (_req, res) => res.send('Successfully called the web server'));

// 4) Routes (mount ONCE, after app is created)
app.use('/auth', rateLimit({ windowMs: 60_000, max: 60 }), authRoutes);

const bcrypt = require('bcryptjs');
const User = require('./models/User');

app.post('/__seed_user', async (req, res) => {
  try {
    const username = 'app_user';
    const passwordHash = await bcrypt.hash('12345', 12);
    const user = await User.findOneAndUpdate(
      { username: username.toLowerCase() },
      { username: username.toLowerCase(), passwordHash, roles: ['admin'], active: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ id: user._id, username: user.username, roles: user.roles, active: user.active });
  } catch (e) {
    console.error('seed error:', e);
    res.status(500).json({ error: 'seed failed' });
  }
});












// 5) 404 + error handler (keep last)
app.use((_req, res) => res.status(404).json({ error: 'No' }));
app.use(errorHandler);

// 6) Connect DB & start server
const PORT = process.env.PORT || 3000;
(async () => {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'shellhacks',
    });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Mongo connect error:', err.message);
    process.exit(1);
  }
})();
