const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsApp = async (phone, message) => {
  try {
    // Remove all spaces and special characters
    let cleaned = phone.toString().replace(/\D/g, '');

    // Add India country code if number is 10 digits
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }

    const toNumber = `whatsapp:+${cleaned}`;
    console.log('Sending WhatsApp to:', toNumber);

    const msg = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to:   toNumber,
      body: message
    });

    console.log('WhatsApp sent successfully:', msg.sid);
  } catch (err) {
    console.error('WhatsApp error:', err.message);
  }
};

module.exports = sendWhatsApp;