const jwt = require("jsonwebtoken");

const generateToken = (payload, secret, config) => {
    return jwt.sign(payload, secret, config);
};

const generatePayloadFromUser = async user => {
    user.getRoles().then(roles => {
        const authorities = roles.map(role => role.name);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: authorities
        };
    }).catch(function (e) {
        console.log(e);
        return;
    });
};

const getPayloadFromToken = async (token, secret) => {
    let payload = {}, error = false;
    try {
        payload = await jwt.verify(token, secret);
    } catch (e) {
        error = true;
        payload['errorMsg'] = e;
    }
    payload['error'] = error;
    return payload;
};

const getTokenFromRequest = (req) => {
    return req.headers["x-access-token"];
};

module.exports = {
    generateToken,
    getTokenFromRequest,
    getPayloadFromToken,
    generatePayloadFromUser
}