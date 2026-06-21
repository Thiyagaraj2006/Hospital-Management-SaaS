const supabase = require("../config/supabase");
const { sendEmail } = require("./emailService");
const { sendWhatsApp } = require("./whatsappService");

/**
 * Creates a notification record in the database, and (best-effort) sends
 * an email and/or WhatsApp message. Designed to never throw — notification
 * delivery problems should not block the calling request.
 *
 * @param {Object} params
 * @param {string} params.userId - users.id to notify
 * @param {string} params.message - short message stored + emailed
 * @param {string} [params.email] - recipient email for Nodemailer
 * @param {string} [params.phone] - recipient phone (E.164) for WhatsApp
 * @param {string} [params.subject] - email subject line
 */
async function notify({ userId, message, email, phone, subject = "MediCare Notification" }) {
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      message,
      is_read: false,
    });
  } catch (err) {
    console.error("[notificationService] Failed to store notification:", err.message);
  }

  const tasks = [];

  if (email) {
    tasks.push(
      sendEmail({
        to: email,
        subject,
        html: `<p>${message}</p>`,
        text: message,
      })
    );
  }

  if (phone) {
    tasks.push(sendWhatsApp({ to: phone, message }));
  }

  if (tasks.length) {
    await Promise.allSettled(tasks);
  }
}

module.exports = { notify };
