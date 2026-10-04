const logger = require('../services/logger');

// GOOD PATTERN: centralized error shape, no stack trace leakage to the client.
// GOOD PATTERN: errors are logged through a structured logger instead of
// raw console.error calls, making them searchable and parseable in
// production log aggregation tools.
function errorHandler(err, req, res, next) {
  logger.error(err.message, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(err.status || 500).json({
    error: 'Something went wrong. Please try again later.',
  });
}

module.exports = errorHandler;
