import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { email } = req.body;

    // Basic Validation
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    // Get current date and time
    const now = new Date();
    const dateStr = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    // Get location from request headers (IP-based approximation)
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const location = `IP: ${ip}`;

    // CSV file path
    const csvPath = path.join('/tmp', 'newsletter-subscriptions.csv');

    // Prepare CSV row
    const csvRow = `"${email}","${dateStr}","${location}","${userAgent}"\n`;

    try {
        // Check if CSV file exists, if not create with headers
        if (!fs.existsSync(csvPath)) {
            const csvHeaders = '"Email","Date","Location","User Agent"\n';
            fs.writeFileSync(csvPath, csvHeaders, 'utf8');
        }

        // Append new subscription to CSV
        fs.appendFileSync(csvPath, csvRow, 'utf8');

        // Configure SMTP Transporter
        const transporter = nodemailer.createTransport({
            host: "mail.smtp2go.com",
            port: 2525,
            secure: false,
            auth: {
                user: "tandoorhayward",
                pass: "KkHhw0is7DHJbLIC",
            },
        });

        // Read CSV file content
        const csvContent = fs.readFileSync(csvPath, 'utf8');

        // Email to Business with CSV attachment
        const mailOptions = {
            from: '"Tandoor Website" <noreply@tandoorhayward.com>',
            to: 'Tandoorihayward@gmail.com, agent6064@gmail.com',
            subject: `New Newsletter Subscription: ${email}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); padding: 30px; text-align: center; }
                        .logo { max-width: 200px; height: auto; }
                        .content { padding: 30px; background: #ffffff; }
                        .info-box { background: #FFF8E7; padding: 20px; border-left: 4px solid #F5A623; margin: 20px 0; }
                        .field { margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 5px; }
                        .label { font-weight: bold; color: #8B0000; }
                        .footer { background: #2c2c2c; color: #ffffff; padding: 20px; text-align: center; font-size: 14px; }
                        .footer a { color: #F5A623; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://tandoorhayward.com/assets/tandoor-india-logo.webp" alt="Tandoor India" class="logo">
                        </div>
                        <div class="content">
                            <h2 style="color: #8B0000;">New Newsletter Subscription</h2>
                            <div class="info-box">
                                <div class="field">
                                    <span class="label">Email:</span> ${email}
                                </div>
                                <div class="field">
                                    <span class="label">Date:</span> ${dateStr}
                                </div>
                                <div class="field">
                                    <span class="label">Location:</span> ${location}
                                </div>
                            </div>
                            <p>The complete list of all newsletter subscriptions is attached as a CSV file.</p>
                        </div>
                        <div class="footer">
                            <p>Tandoor India Hayward | <a href="https://tandoorhayward.com">tandoorhayward.com</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            attachments: [
                {
                    filename: 'newsletter-subscriptions.csv',
                    content: csvContent,
                    contentType: 'text/csv'
                }
            ]
        };

        // Send Email to Business
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Thank you for subscribing to our newsletter!'
        });

    } catch (error) {
        console.error('Error processing newsletter subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again later.'
        });
    }
}
