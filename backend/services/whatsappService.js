let twilioClient = null;

function getClient() {
  if (twilioClient) return twilioClient;

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn("[whatsappService] Twilio env vars missing — WhatsApp messages will be skipped.");
    return null;
  }

  // Lazy-require so the app still boots if 'twilio' package isn't installed yet.
  const twilio = require("twilio");
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return twilioClient;
}

/**
 * Sends a WhatsApp message via Twilio's WhatsApp sandbox/API.
 * `to` should be a plain phone number with country code, e.g. +919876543210
 */
async function sendWhatsApp({ to, message }) {
  try {
    const client = getClient();
    if (!client || !to) return { sent: false, reason: "client or recipient missing" };

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message,
    });

    return { sent: true };
  } catch (err) {
    console.error("[whatsappService] Failed to send WhatsApp message:", err.message);
    return { sent: false, reason: err.message };
  }
}

module.exports = { sendWhatsApp };
