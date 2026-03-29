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
    
    // Save to DB first
    await prisma.contact.create({
      data: { name, email, message }
    });

    // Handle email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // use SSL
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          },
          connectionTimeout: 15000, 
          socketTimeout: 15000
        });

        // Verify connection before sending
        await transporter.verify();

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

        // Send both mails
        await Promise.all([
          transporter.sendMail(mailOptions),
          transporter.sendMail(autoReplyOptions)
        ]);

        console.log("Emails sent successfully for contact request from:", name);
        return res.status(200).json({ success: true, message: 'Message sent successfully!' });

      } catch (emailError) {
        console.error("Email Sending Error:", emailError);
        // We still saved it to the DB, but email failed
        return res.status(500).json({ 
          success: false, 
          message: 'Message saved, but email notification failed. I will check it soon.',
          error: emailError.message 
        });
      }
    } else {
      console.warn("SMTP credentials missing, only saving to database.");
      return res.status(200).json({ success: true, message: 'Message received (Email notification skipped)' });
    }
  } catch (error) {
    console.error('Contact database error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to submit form.' });
    }
  }
};

module.exports = { submitContact };
