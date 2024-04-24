const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleware");
const authController = require("../controller/authController");
const {methodNotAllowed} = require("../util/helper");

const BASE_PREFIX = "/api/auth";

router.route("/signup")
    .post(
        authMiddleWare.verifyUserRequestObject,
        authController.signup
    ).all(methodNotAllowed);

router.route("/signup/verify-email")
    .get(authController.signupEmailVerify)
    .all(methodNotAllowed);

router.route("/signup/verify-email/resend")
    .post(authController.resendSignupEmailVerification)
    .all(methodNotAllowed);

router.route("/signin")
    .post(
        authMiddleWare.verifySignInRequestObject,
        authController.signin
    ).all(methodNotAllowed);

router.route("/token/refresh")
    .post(
        authMiddleWare.verifyRefreshTokenRequestObject,
        authController.refreshToken
    ).all(methodNotAllowed);

router.route("/token/validate")
    .post(
        authMiddleWare.verifyToken,
        authController.tokenBaseResponse
    ).all(methodNotAllowed);

router.route("/reset-password")
    .post(
        authMiddleWare.verifyResetPasswordRequestObject,
        authController.resetPassword
    )
    .all(methodNotAllowed);

router.route("/reset-password/token-verify")
    .get(authController.resetPasswordTokenVerify)
    .all(methodNotAllowed);

router.route("/update-password")
    .post(
        authMiddleWare.verifyUpdatePasswordRequestObject,
        authController.updatePassword
    )
    .all(methodNotAllowed);



module.exports = {
    router,
    basePrefix: BASE_PREFIX
};