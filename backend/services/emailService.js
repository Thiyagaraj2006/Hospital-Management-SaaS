const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn("[emailService] SMTP env vars missing — emails will be skipped.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

/**
 * Sends an email. Fails silently (logs only) so a notification problem
 * never breaks the core appointment-booking flow.
 */
async function sendEmail({ to, subject, html, text }) {
  try {
    const t = getTransporter();
    if (!t || !to) return { sent: false, reason: "transporter or recipient missing" };

    await t.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });

    return { sent: true };
  } catch (err) {
    console.error("[emailService] Failed to send email:", err.message);
    return { sent: false, reason: err.message };
  }
}

module.exports = { sendEmail };
