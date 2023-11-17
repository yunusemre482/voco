const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const {
    SENDER_EMAIL,
    SENDER_EMAIL_PASSWORD,
    FRONTEND_URL,
} = require('../constants/environment');

// TODO: Use handlebars to render email templates instead of this approach of replacing placeholders with values in HTML file directly

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_EMAIL_PASSWORD,
    },
});

async function sendEmail({ to, subject, content }) {
    try {
        const mailOptions = {
            from: SENDER_EMAIL,
            to,
            subject,
            html: content,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`Message sent: ${info.messageId}`);
        return info;
    } catch (error) {
        return error;
    }
}

async function sendVerificationEmail({ to, token }) {
    console.log('sendVerificationEmail', to, token);
    const subject = 'Verify your email';
    const content = renderEmailTemplate('email-verification', [
        { key: 'appLink', value: FRONTEND_URL },
        {
            key: 'verificationLink',
            value: `${FRONTEND_URL}/verify-email?token=${token}`,
        },
        {
            key: 'unsubscriptionLink',
            value: `${FRONTEND_URL}/unsubscribe?token=${token}`,
        },
    ]);

    await sendEmail({ to, subject, content });
}

async function sendPasswordResetEmail({ to, token }) {
    const subject = 'Reset your password';
    const content = renderEmailTemplate('password-reset', [
        { key: 'appLink', value: FRONTEND_URL },
        {
            key: 'resetPasswordLink',
            value: `${FRONTEND_URL}/reset-password?token=${token}`,
        },
        {
            key: 'unsubscriptionLink',
            value: `${FRONTEND_URL}/unsubscribe?token=${token}`,
        },
    ]);

    if (!content) return;

    await sendEmail({ to, subject, content });
}

function renderEmailTemplate(template, data) {
    const file = fs.readFileSync(
        path.join(__dirname, `/email-templates/${template}.html`),
        'utf8'
    );

    console.log(file);

    try {
        let content = emailVerificationTemplate;

        data.forEach((element) => {
            content = content.replaceAll(`{{${element.key}}}`, element.value);
        });

        return content;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    renderEmailTemplate,
};
