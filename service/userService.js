const Joi = require('joi');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../model");
const config = require("../config/auth.config");
const emailConfig = require("../config/email.config");
const tokenUtil = require("../util/tokenUtil");
const {msg} = require("../util/msg");
const emailService = require("./emailService");
const userRepository = require('../repository/userRepository');
const tokenRepository = require('../repository/tokenRepository');
const roleRepository = require('../repository/roleRepository');
const {TOKEN_TYPE} = require('../util/enum/TOKEN_TYPE');
const {EMAIL_TEMPLATE} = require('../util/enum/EMAIL_TEMPLATE');
const refreshTokenService = require("./refreshTokenService");
const helper = require("../util/helper");
const {ROLES} = require("../util/enum/ROLE");

const checkUserByEmail = async (email) => {
    const user = await userRepository.getUserIdByEmail(email);
    if (user != null) {
        throw new Error(msg.user_already_exits);
    }
}

const userSchema = Joi.object({
    email: Joi.string()
        .email({tlds: {allow: false}})
        .external(checkUserByEmail)
        .required(),
    password: Joi.string()
        .required()
});


const signInSchema = Joi.object({
    email: Joi.string()
        .email({tlds: {allow: false}})
        .required(),
    password: Joi.string()
        .required()
});

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
        .required(),
});

const resetPasswordSchema = Joi.object({
    email: Joi.string()
        .email({tlds: {allow: false}})
        .required(),
});

const updatePasswordSchema = Joi.object({
    newPassword: Joi.string()
        .required(),
    resetPasswordToken: Joi.string()
        .required(),
});

const signupUser = async (request) => {
    const requestBody = request.body;
    let resObject = {error: true, status: 400, msg: [], errorMsg: []};
    const encryptedPassword = bcrypt.hashSync(requestBody.password, 8);

    // First, we start a transaction from your connection and save it into a variable
    const trnX = await db.sequelize.transaction();

    try {
        //user object saved
        const user = await userRepository.saveUser({
            email: requestBody.email,
            password: encryptedPassword,
            emailVerificationTime: null,
            passwordUpdatedAt: new Date(),
        }, trnX);
        resObject.msg.push('Created user object!');

        const payload = {email: requestBody.email}
        const emailVerificationToken = tokenUtil.generateToken(
            payload,
            config.emailVerificationSecret,
            {expiresIn: config.emailVerificationTokenLifeSpan}
        );
        const verificationLink = `${emailConfig.verificationLink}?token=${emailVerificationToken}`;
        const emailVerificationTokenHash = await bcrypt.hash(emailVerificationToken, 8);
        await tokenRepository.saveToken({
            userId: user.id,
            hash: emailVerificationTokenHash,
            type: TOKEN_TYPE.EMAIL_VERIFICATION,
            createdAt: new Date()
        }, trnX);
        resObject.msg.push('Created email verification token!');

        // Send email
        try {
            const bodyParams = {
                userEmail: user.email,
                verificationLink: verificationLink
            }
            await emailService.sendEmail(
                [user.email],
                EMAIL_TEMPLATE.VERIFICATION,
                bodyParams
            )
            resObject.msg.push('Verification link emailed to user!');
        } catch (err) {
            resObject.msg.push(msg.email_delivery_failed)
            resObject.errorMsg.push(msg.email_delivery_failed);
            throw new Error(err.message);
        }

        resObject.error = false;
        resObject.status = 200;
        resObject.msg.push(msg.user_created);

        await trnX.commit();
    } catch (err) {
        resObject.error = true;
        resObject.status = 400;
        resObject.errorMsg.push(err);
        resObject.msg.push(msg.user_create_failed);
        await trnX.rollback();
    }

    return resObject;
}

const verifyEmailVerificationToken = async (token) => {
    const resObject = {status: 400, error: true, msg: null, data: null, errorMsg: []};

    await jwt.verify(token, config.emailVerificationSecret, async (verifyErr, payload) => {
        if (verifyErr) {
            resObject.msg = msg.invalid_token;
            resObject.errorMsg.push(msg.invalid_token, verifyErr);
        } else {
            const user = await userRepository.getUserByEmail(payload.email);

            if (user === null) {
                resObject.status = 404;
                resObject.msg = msg.signin_user_not_found;
            } else if (user.isEmailVerified) {
                resObject.msg = msg.signup_email_already_verified;
            } else {
                const tokenObj = await tokenRepository.getTokenByUser(user.id, TOKEN_TYPE.EMAIL_VERIFICATION);

                if (tokenObj === null) {
                    resObject.msg = msg.invalid_token;
                } else if (!bcrypt.compareSync(token, tokenObj.hash)) {
                    resObject.msg = msg.invalid_token;
                } else {
                    const trnX = await db.sequelize.transaction();
                    try{
                        await userRepository.updateUserById(user.id, {
                            isEmailVerified: true,
                            emailVerificationTime: new Date()
                        }, trnX);

                        //user role saved
                        await roleRepository.assignRoleToUser(user.id, ROLES.ROLE_PLATFORM_ADMIN, trnX);

                        await tokenRepository.deleteTokenById(tokenObj.id);

                        resObject.status = 200;
                        resObject.error = false;
                        resObject.msg = msg.signup_email_verification_successful;
                        await trnX.commit();
                    }catch (err){
                        await trnX.rollback();
                    }
                }
            }
        }
    });

    return resObject;
}

const resendEmailVerificationToken = async (email) => {
    const resObject = {status: 400, error: true, msg: [], data: null, errorMsg: []};

    const user = await userRepository.getUserByEmail(email);

    if (user === null) {
        resObject.status = 404;
        resObject.msg.push(msg.signin_user_not_found);
    } else if (user.isEmailVerified) {
        resObject.msg.push(msg.signup_email_already_verified);
    } else {
        const tokenObj = await tokenRepository.getTokenByUser(user.id, TOKEN_TYPE.EMAIL_VERIFICATION);
        const emailVerificationToken = tokenUtil.generateToken({email}, config.emailVerificationSecret,
            {expiresIn: config.emailVerificationTokenLifeSpan});
        const emailVerificationTokenHash = await bcrypt.hash(emailVerificationToken, 8);
        const verificationLink = `${emailConfig.verificationLink}?token=${emailVerificationToken}`;

        // First, we start a transaction from your connection and save it into a variable
        const trnX = await db.sequelize.transaction();

        try {
            if (tokenObj) {
                await tokenRepository.updateTokenById(tokenObj.id,
                    {hash: emailVerificationTokenHash, createdAt: new Date()},
                    trnX);
                resObject.msg.push(msg.email_verification_token_update);
            } else {
                await tokenRepository.saveToken({
                    userId: user.id,
                    hash: emailVerificationTokenHash,
                    type: TOKEN_TYPE.EMAIL_VERIFICATION,
                    createdAt: new Date()
                }, trnX);
                resObject.msg.push(msg.email_verification_token_new);
            }

            // Send email
            try {
                const bodyParams = {
                    userEmail: user.email,
                    verificationLink: verificationLink
                }
                await emailService.sendEmail(
                    [user.email],
                    EMAIL_TEMPLATE.VERIFICATION,
                    bodyParams
                )

                resObject.status = 200;
                resObject.error = false;
                resObject.msg.push(msg.email_verification_sent_user);

                await trnX.commit();
            } catch (err) {
                resObject.msg.push(msg.email_delivery_failed);
                resObject.errorMsg.push(msg.email_delivery_failed);
                throw new Error(err.message);
            }
        } catch (err) {
            resObject.error = true;
            resObject.status = 400;
            resObject.msg.push(msg.resend_email_verification_token_failed);
            resObject.errorMsg.push(err);
            await trnX.rollback();
        }
    }

    return resObject;
}

const authenticateUser = async (requestBody) => {
    let userNotFound = false;
    let passwordIsValid = true;
    let isEmailNotVerified = false;
    let response = {};
    const user = await userRepository.getUserByEmail(requestBody.email);
    if (user == null) {
        userNotFound = true;
    } else if (!user.isEmailVerified) {
        isEmailNotVerified = true;
    } else {
        passwordIsValid = bcrypt.compareSync(requestBody.password, user.password);
        if (passwordIsValid) {
            const payload = {
                id: user.id,
                email: user.email
            }

            const [accessToken, refreshToken] = await generateAccessAndRefreshToken(payload, payload);

            response = {
                id: user.id,
                email: user.email,
                accessToken,
                refreshToken,
                createdMillis: helper.getCurrentMillis(),
            };

            await refreshTokenService.saveRefreshToken(refreshToken, response);
        }
    }

    return [userNotFound, passwordIsValid, isEmailNotVerified, response];
}

const refreshAccessToken = async (requestBody) => {
    let accessToken = '';
    let refreshToken = '';
    let userNotFound = false;
    let jwtTokenExpired = false;

    const requestedRefreshToken = requestBody.refreshToken;
    await jwt.verify(requestedRefreshToken, config.refreshTokenSecret, async (verifyErr, decoded) => {
        const refreshTokenDb = await refreshTokenService.getRefreshTokenByToken(requestedRefreshToken);
        if (verifyErr || !refreshTokenDb) {
            jwtTokenExpired = true;
        } else {
            const user = await userRepository.getUserByEmail(refreshTokenDb.payload.email);
            if (user == null) {
                userNotFound = true;
            } else {
                const payload = {
                    id: user.id,
                    email: user.email,
                }
                // Generate a new access and a new refresh token
                const [aToken, rToken] = await generateAccessAndRefreshToken(payload, payload);
                accessToken = aToken;
                refreshToken = rToken;

                // Save the new refresh token in cache
                await refreshTokenService.saveRefreshToken(refreshToken, {
                    id: user.id,
                    email: user.email,
                    accessToken,
                    refreshToken,
                    createdMillis: helper.getCurrentMillis(),
                });

                // Delete the already used requestedRefreshToken from cache
                await refreshTokenService.deleteRefreshToken(requestedRefreshToken);
            }
        }
    });

    return [userNotFound, jwtTokenExpired, accessToken, refreshToken];
}

const generateAccessAndRefreshToken = async (accessTokenPayload, refreshTokenPayload) => {
    const accessToken = await generateAccessToken(accessTokenPayload);
    const refreshToken = await generateRefreshToken(refreshTokenPayload);
    return [accessToken, refreshToken];
}

const generateAccessToken = async (accessTokenPayload) => {
    return tokenUtil.generateToken(accessTokenPayload, config.accessTokenSecret,
        {expiresIn: config.accessTokenLifeSpan});
}

const generateRefreshToken = async (refreshTokenPayload) => {
    return tokenUtil.generateToken(refreshTokenPayload, config.refreshTokenSecret,
        {expiresIn: config.refreshTokenLifeSpan});
}

const resetPassword = async (email) => {
    const resObject = {status: 400, error: true, msg: null, data: null, errorMsg: []};

    const user = await userRepository.getUserByEmail(email);

    if (user === null) {
        resObject.status = 404;
        resObject.msg = msg.signin_user_not_found;
        return resObject;
    }

    const tokenObj = await tokenRepository.getTokenByUser(user.id, TOKEN_TYPE.RESET_PASSWORD);

    if(tokenObj
        && (new Date() - tokenObj.createdAt) < helper.convertTimeStringToMillis(config.resetPasswordTokenLifeSpan)) {
        resObject.status = 400;
        resObject.error = true;
        resObject.msg = msg.reset_password_token_time_limit_not_over;
    }else {
        const resetPasswordToken = await tokenUtil.generateToken({ email },
            config.resetPasswordSecret,
            {expiresIn: config.resetPasswordTokenLifeSpan});
        const resetPasswordTokenHash = await bcrypt.hash(resetPasswordToken, 8);
        const resetPasswordLink = `${emailConfig.resetPasswordLink}?token=${resetPasswordToken}`;

        const trnX = await db.sequelize.transaction();
        try {
            if (tokenObj) {
                await tokenRepository.updateTokenById(tokenObj.id,
                    {hash: resetPasswordTokenHash, createdAt: new Date()}, trnX);
            } else {
                await tokenRepository.saveToken({
                    userId: user.id,
                    hash: resetPasswordTokenHash,
                    type: TOKEN_TYPE.RESET_PASSWORD,
                    createdAt: new Date()
                }, trnX)
            }

            // Send email
            try {
                const bodyParams = {
                    resetPasswordLink: resetPasswordLink,
                    userEmail: user.email
                }
                await emailService.sendEmail(
                    [user.email],
                    EMAIL_TEMPLATE.RESET_PASSWORD,
                    bodyParams
                )

                resObject.status = 200;
                resObject.error = false;
                resObject.msg = msg.reset_password_email_successful;

                await trnX.commit();
            } catch (err) {
                resObject.msg = msg.email_delivery_failed;
                resObject.errorMsg.push(msg.email_delivery_failed);
                throw new Error(err.message);
            }
        } catch (err) {
            resObject.error = true;
            resObject.status = 400;
            resObject.msg.push(msg.reset_password_failed);
            resObject.errorMsg.push(err);
            await trnX.rollback();
        }
    }

    return resObject;
}

const resetPasswordTokenVerify = async (token) => {
    const resObject = {status: 400, error: true, msg: null, data: null, errorMsg: []};

    await jwt.verify(token, config.resetPasswordSecret, async (verifyErr, payload) => {
        if (verifyErr) {
            resObject.msg = msg.invalid_token;
            resObject.errorMsg.push(msg.invalid_token, verifyErr);
        } else {
            const user = await userRepository.getUserByEmail(payload.email);
            if (user === null) {
                resObject.status = 404;
                resObject.msg = msg.signin_user_not_found;
            } else {
                const tokenObj = await tokenRepository.getTokenByUser(user.id, TOKEN_TYPE.RESET_PASSWORD);

                if (tokenObj === null) {
                    resObject.msg = msg.invalid_token;
                } else if (!bcrypt.compareSync(token, tokenObj.hash)) {
                    resObject.msg = msg.invalid_token;
                } else {
                    resObject.status = 200;
                    resObject.error = false;
                    resObject.msg = msg.token_valid;
                }
            }
        }
    });

    return resObject
}

const updatePassword = async (token, password) => {
    const resObject = {status: 400, error: true, msg: null, data: null, errorMsg: []};

    await jwt.verify(token, config.resetPasswordSecret, async (verifyErr, payload) => {
        if (verifyErr) {
            resObject.msg = msg.invalid_token;
            resObject.errorMsg.push(msg.invalid_token, verifyErr);
        } else {
            const user = await userRepository.getUserByEmail(payload.email);

            if (user === null) {
                resObject.status = 404;
                resObject.msg = msg.signin_user_not_found;
            } else {
                const tokenObj = await tokenRepository.getTokenByUser(user.id, TOKEN_TYPE.RESET_PASSWORD);

                if (tokenObj === null) {
                    resObject.msg = msg.invalid_token;
                } else if (!bcrypt.compareSync(token, tokenObj.hash)) {
                    resObject.msg = msg.invalid_token;
                } else {
                    const trnX = await db.sequelize.transaction();
                    try {
                        await userRepository.updateUserById(user.id, {
                            password: bcrypt.hashSync(password, 8),
                            passwordUpdatedAt: new Date(),
                        }, trnX);
                        await tokenRepository.deleteTokenById(tokenObj.id, trnX);

                        resObject.status = 200;
                        resObject.error = false;
                        resObject.msg = msg.password_update_successful;
                        await trnX.commit();
                    } catch (err) {
                        resObject.error = true;
                        resObject.status = 400;
                        resObject.msg.push(msg.password_update_failed);
                        resObject.errorMsg.push(err);
                        await trnX.rollback();
                    }
                }
            }
        }
    });

    return resObject
}

module.exports = {
    userSchema,
    signInSchema,
    refreshTokenSchema,
    resetPasswordSchema,
    updatePasswordSchema,
    signupUser,
    authenticateUser,
    refreshAccessToken,
    verifyEmailVerificationToken,
    resendEmailVerificationToken,
    resetPassword,
    resetPasswordTokenVerify,
    updatePassword
}
