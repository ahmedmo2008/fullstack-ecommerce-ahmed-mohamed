require('dotenv').config();
const nodemailer = require('nodemailer');

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const internalKey = req.headers['x-internal-key'];
  if (!process.env.INTERNAL_FUNCTION_KEY || internalKey !== process.env.INTERNAL_FUNCTION_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { to, name } = req.body || {};

  if (!to || !name) {
    return res.status(400).json({ message: 'to and name are required' });
  }

  if (!process.env.SMTP_HOST) {
    console.log(`SMTP not configured, skipping welcome email to ${to}`);
    return res.status(200).json({ sent: false, reason: 'SMTP not configured' });
  }

  try {
    const transporter = createTransport();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@aterra.shop',
      to,
      subject: 'Welcome to Aterra',
      html: `<p>Hi ${name},</p><p>Thanks for creating an account with Aterra. We're glad to have you.</p>`,
    });

    return res.status(200).json({ sent: true });
  } catch (err) {
    console.error('Failed to send welcome email:', err.message);
    return res.status(500).json({ sent: false, error: err.message });
  }
};
