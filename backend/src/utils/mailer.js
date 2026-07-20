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

async function sendWelcomeEmail(to, name) {
  if (!process.env.SMTP_HOST) {
    console.log(`SMTP not configured, skipping welcome email to ${to}`);
    return;
  }

  try {
    const transporter = createTransport();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@aterra.shop',
      to,
      subject: 'Welcome to Aterra',
      html: `<p>Hi ${name},</p><p>Thanks for creating an account with Aterra. We're glad to have you.</p>`,
    });
  } catch (err) {
    console.error('Failed to send welcome email:', err.message);
  }
}

module.exports = { sendWelcomeEmail };
