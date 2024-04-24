const db = require("../model");
const {Op} = require('sequelize');
const RefreshToken = db.refreshToken;

const saveToken = async (tokenObj, transaction) => {
    let options = {};
    if (transaction) {
        options['transaction'] = transaction;
    }
    return await RefreshToken.create(tokenObj, options);
}

const getRefreshTokenByToken = async (token, transaction) => {
    return await RefreshToken.findOne({
        where: {
            refreshToken: token
        },
        transaction: transaction ? transaction : null
    });
}

const deleteRefreshToken = async (token, transaction) => {
    await RefreshToken.destroy({
        where: {
            refreshToken: token
        },
        transaction: transaction ? transaction : null
    });
}

const deleteExpiredRefreshToken = async (cutOffDate, transaction) => {
    await RefreshToken.destroy({
        where: {
            expireAt: {
                [Op.lt]: cutOffDate
            }
        },
        transaction: transaction ? transaction : null
    });
}

const truncateRefreshTokenTable = async () => {
    await RefreshToken.truncate();
}

module.exports = {
    saveToken,
    getRefreshTokenByToken,
    deleteRefreshToken,
    deleteExpiredRefreshToken,
    truncateRefreshTokenTable
}
