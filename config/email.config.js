const emailConfig = {
    fromEmailAddress: process.env.AWS_SES_EMAIL_SENDER,
    verificationLink: process.env.EMAIL_VERIFICATION_LINK,
    resetPasswordLink: process.env.EMAIL_RESET_PASSWORD_LINK,
};

module.exports = emailConfig;