const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    
    await prisma.contact.create({
      data: { name, email, message }
    });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL || 'smakhija140@gmail.com',
            subject: `New Contact Request from ${name}`,
            text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email
        };

        // Automated reply to the user
        const autoReplyOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Thank you for reaching out, ${name}!`,
            text: `Hi ${name},\n\nThank you for contacting me! I have received your message and will get back to you as soon as possible.\n\nHere is a copy of your message:\n"${message}"\n\nBest regards,\nSaksham Makhija`
        };

        await transporter.sendMail(mailOptions);
        await transporter.sendMail(autoReplyOptions);
    }

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit form.' });
  }
};

module.exports = { submitContact };
