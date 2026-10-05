// GOOD PATTERN: centralized error shape, no stack trace leakage to the client.
// MINOR NITPICK (low-to-medium severity): uses console.error directly
// instead of a structured logger (e.g. pino/winston), which makes
// errors harder to search and correlate in production.
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    error: 'Something went wrong. Please try again later.',
  });
}

module.exports = errorHandler;
