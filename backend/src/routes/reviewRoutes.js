const express = require('express');
const axios = require('axios');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL;

function forwardAuthHeader(req) {
  return req.headers.authorization
    ? { Authorization: req.headers.authorization }
    : {};
}

router.get('/:productId', async (req, res, next) => {
  try {
    const response = await axios.get(
      `${REVIEW_SERVICE_URL}/reviews/${req.params.productId}`
    );
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
});

router.post('/:productId', requireAuth, async (req, res, next) => {
  try {
    const response = await axios.post(
      `${REVIEW_SERVICE_URL}/reviews/${req.params.productId}`,
      req.body,
      { headers: forwardAuthHeader(req) }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const response = await axios.delete(
      `${REVIEW_SERVICE_URL}/reviews/${req.params.id}`,
      { headers: forwardAuthHeader(req) }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
});

module.exports = router;
