const axios = require('axios');

async function sendWelcomeEmail(to, name) {
  const baseUrl = process.env.SELF_BASE_URL;

  if (!baseUrl) {
    console.log('SELF_BASE_URL not configured, skipping welcome email trigger');
    return;
  }

  try {
    await axios.post(
      `${baseUrl}/api/internal/send-welcome-email`,
      { to, name },
      {
        headers: { 'x-internal-key': process.env.INTERNAL_FUNCTION_KEY },
        timeout: 5000,
      }
    );
  } catch (err) {
    console.error('Failed to trigger welcome email function:', err.message);
  }
}

module.exports = { sendWelcomeEmail };
