module.exports = {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenLifeSpan: process.env.JWT_ACCESS_TOKEN_AGE,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenLifeSpan: process.env.JWT_REFRESH_TOKEN_AGE,
    emailVerificationSecret: process.env.JWT_EMAIL_VERIFICATION_SECRET,
    emailVerificationTokenLifeSpan: process.env.JWT_EMAIL_VERIFICATION_TOKEN_AGE,
    resetPasswordTokenLifeSpan: process.env.JWT_RESET_PASSWORD_TOKEN_AGE,
    resetPasswordSecret: process.env.JWT_RESET_PASSWORD_SECRET,
};