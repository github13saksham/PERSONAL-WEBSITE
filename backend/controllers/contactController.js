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
    
    // 1. Attempt to Save to Database
    try {
      await prisma.contact.create({
        data: { name, email, message }
      });
      console.log("Contact saved to database for:", name);
    } catch (dbError) {
      console.error('Database Error:', dbError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error: Could not save your message.',
        error: dbError.message 
      });
    }

    // 2. Attempt to Send Email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log("Configuring email transporter for:", process.env.EMAIL_USER);
        const transporter = nodemailer.createTransport({
          service: 'gmail', // Simplify for Gmail
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          },
          tls: {
            // Do not fail on invalid certificates (common on shared cloud systems)
            rejectUnauthorized: false
          },
          connectionTimeout: 15000, 
          socketTimeout: 15000,
          logger: true, // Output logs to console
          debug: true   // Include debug info
        });

        console.log("Verifying SMTP connection...");
        await transporter.verify();
        console.log("SMTP connection verified!");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL || 'smakhija140@gmail.com',
            subject: `New Contact Request from ${name}`,
            text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email
        };

        const autoReplyOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Thank you for reaching out, ${name}!`,
            text: `Hi ${name},\n\nThank you for contacting me! I have received your message and will get back to you as soon as possible.\n\nHere is a copy of your message:\n"${message}"\n\nBest regards,\nSaksham Makhija`
        };

        await Promise.all([
          transporter.sendMail(mailOptions),
          transporter.sendMail(autoReplyOptions)
        ]);

        console.log("Emails sent successfully for:", name);
        return res.status(200).json({ 
          success: true, 
          message: 'Message sent successfully!' 
        });

      } catch (emailError) {
        console.error("SMTP Email Error:", emailError);
        return res.status(500).json({ 
          success: false, 
          message: 'Message saved, but email service failed.',
          error: emailError.message 
        });
      }
    } else {
      console.warn("SMTP credentials missing.");
      return res.status(200).json({ 
        success: true, 
        message: 'Message received (Notification skipped)' 
      });
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'An unexpected error occurred.', error: error.message });
    }
  }
};

module.exports = { submitContact };
