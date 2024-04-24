const jwt = require("jsonwebtoken");

const {msg} = require("../util/msg");
const {responseGenerator} = require("../util/helper");
const config = require("../config/auth.config");
const userService = require("../service/userService");

const verifyUserRequestObject = async (req, res, next) => {
    try {
        await userService.userSchema.validateAsync(req.body);
        next();
    } catch (err) {

        res.status(422).send(responseGenerator(req, false, 422, err.message, null, err.message));
    }
}

const verifySignInRequestObject = async (req, res, next) => {
    try {
        await userService.signInSchema.validateAsync(req.body);
        next();
    } catch (err) {

        res.status(422).send(responseGenerator(req, false, 422, err.message, null, err));
    }
}

const verifyRefreshTokenRequestObject = async (req, res, next) => {
    try {
        await userService.refreshTokenSchema.validateAsync(req.body);
        next();
    } catch (err) {

        res.status(422).send(responseGenerator(req, false, 422, err.message, null, err.message));
    }
}

const verifyResetPasswordRequestObject = async (req, res, next) => {
    try {
        await userService.resetPasswordSchema.validateAsync(req.body);
        next();
    } catch (err) {

        res.status(422).send(responseGenerator(req, false, 422, err.message, null, err.message));
    }
}

const verifyUpdatePasswordRequestObject = async (req, res, next) => {
    try {
        await userService.updatePasswordSchema.validateAsync(req.body);
        next();
    } catch (err) {

        res.status(422).send(responseGenerator(req, false, 422, err.message, null, err.message));
    }
}

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.query.x_access_token;
    if (!token) {
        return res.status(403).send(responseGenerator(req, false, 403,
            msg.missing_token, null, msg.missing_token));
    }
    jwt.verify(token, config.accessTokenSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send(responseGenerator(req, false, 401,
                err.message, null, err.message));
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = {
    verifyUserRequestObject,
    verifySignInRequestObject,
    verifyRefreshTokenRequestObject,
    verifyResetPasswordRequestObject,
    verifyUpdatePasswordRequestObject,
    verifyToken
}