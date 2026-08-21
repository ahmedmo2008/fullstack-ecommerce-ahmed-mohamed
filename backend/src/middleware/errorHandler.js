const logger = require('../utils/logger');

function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error(message, {
    status,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
