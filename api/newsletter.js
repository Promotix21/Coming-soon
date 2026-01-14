import nodemailer from 'nodemailer';

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
        hour12: true,
        timeZone: 'America/Los_Angeles'
    });

    // Get location from request headers (IP-based approximation)
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const location = `IP: ${ip}`;

    try {
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

        // Email to Business - No CSV attachment (Vercel serverless doesn't support persistent storage)
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
                        .footer { background: #2c2c2c; color: #ffffff; padding: 30px 20px; text-align: center; font-size: 14px; }
                        .footer a { color: #F5A623; text-decoration: none; }
                        .footer p { margin: 8px 0; }
                        .footer strong { color: #ffffff; }
                        .social-links { margin-top: 15px; }
                        .social-links a { color: #F5A623; text-decoration: none; margin: 0 10px; font-size: 16px; }
                        .social-links a:hover { color: #ffffff; }
                        .note { background: #f0f8ff; padding: 15px; margin: 20px 0; border-left: 4px solid #4682b4; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://www.tandoorhayward.com/assets/images/logo%20(2).webp" alt="Tandoor India" class="logo">
                        </div>
                        <div class="content">
                            <h2 style="color: #8B0000;">🎉 New Newsletter Subscription</h2>
                            <div class="info-box">
                                <div class="field">
                                    <span class="label">Email:</span> ${email}
                                </div>
                                <div class="field">
                                    <span class="label">Date & Time:</span> ${dateStr} (PST)
                                </div>
                                <div class="field">
                                    <span class="label">Location:</span> ${location}
                                </div>
                                <div class="field">
                                    <span class="label">Browser:</span> ${userAgent}
                                </div>
                            </div>
                            <div class="note">
                                <strong>💡 Tip:</strong> Save these emails in a dedicated folder to maintain your subscriber list.
                                You can export them to your email marketing platform (Mailchimp, Constant Contact, etc.) anytime.
                            </div>
                        </div>
                        <div class="footer">
                            <p><strong>Tandoor Indian Restaurant</strong></p>
                            <p>27167 Mission Blvd, Hayward, CA 94544</p>
                            <p>Phone: <a href="tel:5108851212">(510) 885-1212</a></p>
                            <p>Email: <a href="mailto:Tandoorihayward@gmail.com">Tandoorihayward@gmail.com</a></p>
                            <p><a href="https://www.tandoorhayward.com">www.tandoorhayward.com</a></p>
                            <div class="social-links">
                                <a href="https://www.instagram.com/tandoor__indian__restaurant/" target="_blank">Instagram</a> |
                                <a href="https://www.facebook.com/people/Tandoor-Indian-Restaurant/61568200572729/?ref=1" target="_blank">Facebook</a>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
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
