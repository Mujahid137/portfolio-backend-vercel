// api/contact.js
const nodemailer = require("nodemailer");

/**
 * Vercel Serverless Function
 * URL: https://your-project-name.vercel.app/api/contact
 */
module.exports = async (req, res) => {
  // ============
  // CORS HEADERS
  // ============
  res.setHeader("Access-Control-Allow-Origin", "https://mujahid137.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { name, email, message, subject } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are required.",
    });
  }

  try {
    // Transporter using Gmail (with App Password)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === "true" ? true : false, // false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || `New message from ${name}`,
      text: `You have a new message from your portfolio contact form:

Name: ${name}
Email: ${email}

Message:
${message}
`,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to send email.",
    });
  }
};
