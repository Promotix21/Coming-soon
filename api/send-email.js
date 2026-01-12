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
        // Construct Email Content based on Form Type
        let mailSubject = `New Website Inquiry: ${subject || 'No Subject'}`;
        let htmlContent = `
            <h2>New Website Inquiry</h2>
            <p><strong>Name:</strong> ${firstName || ''} ${lastName || ''}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <br>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `;

        if (formType === 'Catering') {
            mailSubject = `New Catering Inquiry: ${firstName || 'Client'} - ${eventDate || ''}`;
            htmlContent = `
                <h2>New Catering Inquiry</h2>
                <div style="background: #FFF8E7; padding: 20px; border-left: 4px solid #F5A623;">
                    <p><strong>Name:</strong> ${firstName || ''} ${lastName || ''}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                    <hr>
                    <p><strong>Event Date:</strong> ${eventDate || 'Not specified'}</p>
                    <p><strong>Guest Count:</strong> ${guestCount || 'Not specified'}</p>
                    <p><strong>Event Type:</strong> ${eventType || 'Not specified'}</p>
                    <br>
                    <p><strong>Special Requests / Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
            `;
        }

        const mailOptions = {
            from: '"Tandoor Website" <no-reply@tandoorhayward.com>',
            to: 'Guptamansha1998hsp@gmail.com, agent6064@gmail.com',
            subject: mailSubject,
            html: htmlContent,
            replyTo: email
        };

        // Send Email
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        return res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
}