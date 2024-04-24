const db = require("../model");
const refreshTokenRepository = require("../repository/refreshTokenRepository");
const config = require("../config/auth.config");
const helper = require("../util/helper");

const saveRefreshToken = async (token, payload) => {
    let refreshToken = {};
    try{
        const regex = /(\d+)m/; // Match one or more digits followed by 'm'
        const match = config.refreshTokenLifeSpan.match(regex);
        const minutesToAdd = match && match[1] ? parseInt(match[1], 10) : 10;

        refreshToken = await refreshTokenRepository.saveToken({
            refreshToken: token,
            payload,
            expireAt: helper.addMinutes(+minutesToAdd)
        });
    } catch (e) {
        console.error(e)
    }
    return refreshToken;
}

const getRefreshTokenByToken = async(token) => {
    let refreshToken = {};
    try{
        refreshToken = await refreshTokenRepository.getRefreshTokenByToken(token);
    } catch (e) {
        console.error(e)
    }
    return refreshToken;
}

const deleteRefreshToken = async (token) => {
    try{
        await refreshTokenRepository.deleteRefreshToken(token);
    } catch (e) {
        console.error(e)
    }
}

const deleteExpiredRefreshToken = async () => {
    const trnX = await db.sequelize.transaction();
    try{
        await refreshTokenRepository.deleteExpiredRefreshToken(helper.currentDate(), trnX);
        await trnX.commit();
    } catch (e) {
        await trnX.rollback();
        console.error(e)
    }
}

const neutralizeRefreshToken = async () => {
    try{
        await refreshTokenRepository.truncateRefreshTokenTable();
        console.log("::: DB TABLE refresh_tokens cleanup on app startup completed :::");
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    saveRefreshToken,
    getRefreshTokenByToken,
    deleteRefreshToken,
    deleteExpiredRefreshToken,
    neutralizeRefreshToken
}