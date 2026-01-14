import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { firstName, lastName, email, phone, subject, message, formType, eventDate, guestCount, eventType } = req.body;

    // Basic Validation
    if (!email || !message) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Configure Transporter with provided SMTP2GO credentials
    const transporter = nodemailer.createTransport({
        host: "mail.smtp2go.com",
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "tandoorhayward",
            pass: "KkHhw0is7DHJbLIC",
        },
    });

    try {
        // Email Template Styling
        const emailStyles = `
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
            </style>
        `;

        const logoUrl = 'https://www.tandoorhayward.com/assets/tandoor-india-logo.webp';

        // Construct Email Content based on Form Type
        let mailSubject = `New Website Inquiry: ${subject || 'No Subject'}`;
        let businessHtmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                ${emailStyles}
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="${logoUrl}" alt="Tandoor India" class="logo">
                    </div>
                    <div class="content">
                        <h2 style="color: #8B0000;">New Website Inquiry</h2>
                        <div class="info-box">
                            <div class="field">
                                <span class="label">Name:</span> ${firstName || ''} ${lastName || ''}
                            </div>
                            <div class="field">
                                <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
                            </div>
                            <div class="field">
                                <span class="label">Phone:</span> ${phone || 'N/A'}
                            </div>
                            <div class="field">
                                <span class="label">Subject:</span> ${subject || 'N/A'}
                            </div>
                            <div class="field">
                                <span class="label">Message:</span><br>
                                ${message.replace(/\n/g, '<br>')}
                            </div>
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
        `;

        let customerHtmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                ${emailStyles}
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="${logoUrl}" alt="Tandoor India" class="logo">
                    </div>
                    <div class="content">
                        <h2 style="color: #8B0000;">Thank You for Contacting Tandoor India!</h2>
                        <p>Dear ${firstName || 'Valued Customer'},</p>
                        <p>We have received your message and will get back to you shortly.</p>
                        <div class="info-box">
                            <p><strong>Your message:</strong></p>
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        <p>We appreciate your interest in Tandoor India and look forward to serving you!</p>
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
        `;

        if (formType === 'Catering') {
            mailSubject = `New Catering Inquiry: ${firstName || 'Client'} - ${eventDate || ''}`;
            businessHtmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    ${emailStyles}
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="${logoUrl}" alt="Tandoor India" class="logo">
                        </div>
                        <div class="content">
                            <h2 style="color: #8B0000;">New Catering Inquiry</h2>
                            <div class="info-box">
                                <div class="field">
                                    <span class="label">Name:</span> ${firstName || ''} ${lastName || ''}
                                </div>
                                <div class="field">
                                    <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
                                </div>
                                <div class="field">
                                    <span class="label">Phone:</span> ${phone || 'N/A'}
                                </div>
                                <hr style="margin: 20px 0; border: 1px solid #ddd;">
                                <div class="field">
                                    <span class="label">Event Date:</span> ${eventDate || 'Not specified'}
                                </div>
                                <div class="field">
                                    <span class="label">Guest Count:</span> ${guestCount || 'Not specified'}
                                </div>
                                <div class="field">
                                    <span class="label">Event Type:</span> ${eventType || 'Not specified'}
                                </div>
                                <div class="field">
                                    <span class="label">Special Requests:</span><br>
                                    ${message.replace(/\n/g, '<br>')}
                                </div>
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
            `;

            customerHtmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    ${emailStyles}
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="${logoUrl}" alt="Tandoor India" class="logo">
                        </div>
                        <div class="content">
                            <h2 style="color: #8B0000;">Thank You for Your Catering Inquiry!</h2>
                            <p>Dear ${firstName || 'Valued Customer'},</p>
                            <p>We have received your catering inquiry and will contact you shortly to discuss your event details.</p>
                            <div class="info-box">
                                <p><strong>Your Event Details:</strong></p>
                                <p><strong>Date:</strong> ${eventDate || 'Not specified'}</p>
                                <p><strong>Guest Count:</strong> ${guestCount || 'Not specified'}</p>
                                <p><strong>Event Type:</strong> ${eventType || 'Not specified'}</p>
                            </div>
                            <p>We look forward to making your event memorable with our authentic Indian cuisine!</p>
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
            `;
        }

        // Email to Business
        const mailOptions = {
            from: '"Tandoor Website" <noreply@tandoorhayward.com>',
            to: 'Tandoorihayward@gmail.com, agent6064@gmail.com',
            subject: mailSubject,
            html: businessHtmlContent,
            replyTo: email
        };

        // Confirmation Email to Customer
        const customerMailOptions = {
            from: '"Tandoor India" <noreply@tandoorhayward.com>',
            to: email,
            subject: formType === 'Catering' ? 'Thank You for Your Catering Inquiry - Tandoor India' : 'Thank You for Contacting Tandoor India',
            html: customerHtmlContent
        };

        // Send Email to Business
        const info = await transporter.sendMail(mailOptions);
        console.log('Business email sent: %s', info.messageId);

        // Send Confirmation Email to Customer
        const customerInfo = await transporter.sendMail(customerMailOptions);
        console.log('Customer email sent: %s', customerInfo.messageId);

        return res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
}