const express = require('express');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

// GOOD PATTERN: rate limiting applied globally before routes.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use('/api/users', userRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// GOOD PATTERN: error handler registered last, after routes and the
// 404 fallback, so it correctly catches everything thrown above it.
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
