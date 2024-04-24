const {msg} = require("../util/msg");
const {responseGenerator} = require("../util/helper");
const userService = require('../service/userService');

const signup = async (req, res) => {
    try{
        const response = await userService.signupUser(req);
        res
            .status(response.status)
            .send(responseGenerator(req,
                !response.error,
                response.status,
                response.msg.join(', '),
                null,
                response.errorMsg.join(', ')
            ));
    }catch(err){

        res.status(400).send(responseGenerator(req, false, 400, err.message, null, err.message));
    }
};

const signupEmailVerify = async (req, res) => {
    try{
        const token = req.query.token;
        const response = await userService.verifyEmailVerificationToken(token);

        res
            .status(response.status)
            .send(responseGenerator(req,
                !response.error,
                response.status,
                response.msg,
                response.data,
                response.errorMsg.join(', ')
            ));
    }catch(err){

        res.status(400).send(responseGenerator(req, false, 400, err.message, null, err.message));
    }

}

const resendSignupEmailVerification = async (req, res) => {
    try{
        const email = req.body.email;
        const response = await userService.resendEmailVerificationToken(email);

        res.status(response.status).send(responseGenerator(req, !response.error, response.status,
            response.msg.join(', '), response.data, response.errorMsg.join(', ')));
    }catch(err){

        res.status(400).send(responseGenerator(req, false, 400, err.message, null, err.message));
    }

}

const signin = async (req, res) => {
    try {
        const [userNotFound, passwordIsValid, isEmailNotVerified, response]
            = await userService.authenticateUser(req.body);

        if (userNotFound) {
            res.status(404).send(responseGenerator(req, false, 404,
                msg.signin_user_not_found, null, msg.signin_user_not_found));
        } else if (!passwordIsValid) {
            res.status(403).send(responseGenerator(req, false, 403,
                msg.signin_invalid_password, null, msg.signin_invalid_password));
        } else if(isEmailNotVerified){
            res.status(400).send(responseGenerator(req, false, 400,
                msg.signin_email_not_verified, null, msg.signin_email_not_verified));
        }
        else {
            res.status(200).send(responseGenerator(req, true, 200, msg.signin_success, response));
        }
    } catch (err) {

        res.status(500).send(responseGenerator(req, false, 500, err.message, null, err.message));
    }
};

const refreshToken = async (req, res) => {
    try {
        const [userNotFound,
            tokenExpired,
            accessToken,
            refreshToken] = await userService.refreshAccessToken(req.body);
        if (userNotFound) {
            res.status(404).send(responseGenerator(req, false, 404,
                msg.signin_user_not_found, null, msg.signin_user_not_found));
        } else if (tokenExpired) {
            res.status(400).send(responseGenerator(req, false, 400,
                msg.token_refresh_expired, null, msg.token_refresh_expired));
        } else {
            res.status(200).send(responseGenerator(req, true, 200,
                msg.token_refresh_success,
                {accessToken, refreshToken}));
        }
    } catch (err) {
        res.status(500).send(responseGenerator(req, false, 500, err.message, null, err.message));
    }
}

const tokenBaseResponse = async (req, res) => {
    try{
        const response = {
            id: req.userId,
        }
        res.status(200).send(responseGenerator(req, true, 200, msg.token_valid, response));
    }catch (err) {
        res.status(500).send(responseGenerator(req, false, 500, err.message, null, err.message));
    }
}

const resetPassword = async (req, res) => {
    try{
        const email = req.body.email;
        const response = await userService.resetPassword(email);

        res.status(response.status).send(responseGenerator(req, !response.error, response.status, response.msg, response.data, response.errorMsg.join(', ')));
    }catch(err){

        res.status(400).send(responseGenerator(req, false, 400, err.message, null, err.message));
    }
}

const resetPasswordTokenVerify = async (req, res) => {
    try{
        const token = req.query.resetPasswordToken;
        const response = await userService.resetPasswordTokenVerify(token);

        res.status(response.status).send(responseGenerator(req, !response.error, response.status, response.msg,
            response.data, response.errorMsg.join(', ')));
    }catch(err){

        res.status(400).send(responseGenerator(req, false, 400, err.message, null, err.message));
    }

}

const updatePassword = async (req, res) => {
    try{
        const newPassword = req.body.newPassword;
        const resetPasswordToken = req.body.resetPasswordToken;
        const response = await userService.updatePassword(resetPasswordToken, newPassword);

        res.status(response.status).send(responseGenerator(req, !response.error, response.status, response.msg,
            response.data, response.errorMsg.join(', ')));
    }catch(err){

        res.status(400).send(responseGenerator(req, false, 400, err.message, null, err.message));
    }

}

module.exports = {
    signup,
    signin,
    refreshToken,
    tokenBaseResponse,
    signupEmailVerify,
    resendSignupEmailVerification,
    resetPassword,
    resetPasswordTokenVerify,
    updatePassword
}