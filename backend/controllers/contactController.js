import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const getAdminRecipients = async () => {
  const admins = await User.find({ isAdmin: true }).select('email');
  const fromUsers = admins.map((u) => String(u.email || '').trim()).filter(Boolean);
  const fromEnv = String(process.env.CONTACT_ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const fallback = process.env.EMAIL_FROM ? [String(process.env.EMAIL_FROM).trim()] : [];
  return Array.from(new Set([...fromUsers, ...fromEnv, ...fallback])).filter(Boolean);
};

// @desc    Public contact form submit
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone = '', subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Name, email, subject, and message are required');
  }

  const doc = await ContactMessage.create({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone || '').trim(),
    subject: String(subject).trim(),
    message: String(message).trim(),
  });

  const recipients = await getAdminRecipients();
  if (recipients.length > 0) {
    const safeName = escapeHtml(doc.name);
    const safeEmail = escapeHtml(doc.email);
    const safePhone = escapeHtml(doc.phone || 'Not provided');
    const safeSubject = escapeHtml(doc.subject);
    const safeMessage = escapeHtml(doc.message).replace(/\n/g, '<br/>');
    try {
      await sendEmail({
        email: recipients.join(','),
        subject: `New contact message: ${doc.subject}`,
        message: `
          <h2>New contact message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong><br/>${safeMessage}</p>
          <p><strong>Message ID:</strong> ${doc.id}</p>
        `,
      });
    } catch (err) {
      // Keep the message stored even if SMTP is down.
      console.error('Failed to notify admins about contact message', err);
    }
  }

  res.status(201).json({
    id: doc.id,
    message: 'Message sent successfully',
  });
});

// @desc    Admin list contact messages
// @route   GET /api/contact/admin/messages
// @access  Private/Admin
const getAdminContactMessages = asyncHandler(async (req, res) => {
  const rows = await ContactMessage.find({}).sort({ createdAt: -1 });
  res.json(rows);
});

// @desc    Admin reply to contact message
// @route   POST /api/contact/admin/messages/:id/reply
// @access  Private/Admin
const replyToContactMessage = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  if (!reply || String(reply).trim().length < 2) {
    res.status(400);
    throw new Error('Reply is required');
  }

  const doc = await ContactMessage.findById(req.params.id);
  if (!doc) {
    res.status(404);
    throw new Error('Contact message not found');
  }

  const cleanReply = String(reply).trim();
  doc.adminReply = cleanReply;
  doc.status = 'replied';
  doc.repliedAt = new Date();
  await doc.save();

  const safeName = escapeHtml(doc.name);
  const safeSubject = escapeHtml(doc.subject);
  const safeReply = escapeHtml(cleanReply).replace(/\n/g, '<br/>');
  try {
    await sendEmail({
      email: doc.email,
      subject: `Response from ABS Clothing: ${doc.subject}`,
      message: `
        <p>Hello ${safeName},</p>
        <p>Thanks for contacting ABS Clothing. Here is our response to your message about <strong>${safeSubject}</strong>:</p>
        <blockquote style="margin:16px 0;padding:12px;border-left:3px solid #0A3D2E;background:#f8f8f8;">
          ${safeReply}
        </blockquote>
        <p>If you have further questions, reply to this email.</p>
        <p>— ABS Clothing Team</p>
      `,
    });
  } catch (err) {
    console.error('Failed to send contact reply email', err);
  }

  res.json(doc);
});

export { createContactMessage, getAdminContactMessages, replyToContactMessage };
