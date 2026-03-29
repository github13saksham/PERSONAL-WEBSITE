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

    // 2. Handle Email Notification
    const resendKey = process.env.RESEND_API_KEY;
    
    if (resendKey) {
      try {
        console.log("Using Resend API for email...");
        const https = require('https');
        
        const sendResend = (emailData) => {
          return new Promise((resolve, reject) => {
            const body = JSON.stringify(emailData);
            const options = {
              hostname: 'api.resend.com',
              path: '/emails',
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendKey}`,
                'Content-Type': 'application/json',
                'Content-Length': body.length
              }
            };
            const req = https.request(options, (res) => {
              let resBody = '';
              res.on('data', (d) => resBody += d);
              res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(resBody));
                else reject(new Error(`Resend Error: ${res.statusCode} ${resBody}`));
              });
            });
            req.on('error', reject);
            req.write(body);
            req.end();
          });
        };

        // Send notification to admin
        await sendResend({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: process.env.RECEIVER_EMAIL || 'smakhija140@gmail.com',
          subject: `New Contact Request from ${name}`,
          text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          reply_to: email,
        });

        // Send auto-reply to user (ignore errors for auto-reply as it requires domain verification)
        sendResend({
          from: 'Saksham Makhija <onboarding@resend.dev>',
          to: email,
          subject: `Thank you for reaching out, ${name}!`,
          text: `Hi ${name},\n\nThank you for contacting me! I have received your message and will get back to you as soon as possible.\n\nBest regards,\nSaksham Makhija`
        }).catch(err => console.warn("Auto-reply skipped (likely domain not verified in Resend):", err.message));

        console.log("Resend API emails processed.");
        return res.status(200).json({ success: true, message: 'Message sent successfully!' });

      } catch (resendError) {
        console.error("Resend API Error:", resendError);
        return res.status(500).json({ success: false, message: 'Email service failed via API.', error: resendError.message });
      }
    } 
    // Fallback to SMTP if no Resend Key
    else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log("Falling back to SMTP (Warning: Ports might be blocked on cloud)...");
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
          tls: { rejectUnauthorized: false }
        });

        await transporter.verify();
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL || 'smakhija140@gmail.com',
            subject: `New Contact Request from ${name}`,
            text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email
        });

        return res.status(200).json({ success: true, message: 'Message sent via SMTP!' });
      } catch (smtpError) {
        console.error("SMTP Final Error:", smtpError);
        return res.status(500).json({ success: false, message: 'All email services failed.', error: smtpError.message });
      }
    } else {
      return res.status(200).json({ success: true, message: 'Message saved to database (Email skipped).' });
    }
  } catch (error) {
    console.error('Unexpected Global Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'An unexpected error occurred.', error: error.message });
    }
  }
};

module.exports = { submitContact };
