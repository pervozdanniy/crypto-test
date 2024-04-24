const db = require("../model");
const Token = db.token;

const saveToken = async(tokenObj, transaction) => {
    let options = {};
    if (transaction){
        options['transaction'] = transaction;
    }
    return await Token.create(tokenObj, options);
}

const getTokenByUser = async(userId, tokenType) => {
    return await Token.findOne({
        where: {
            userId: userId,
            type: tokenType
        }
    });
}

const deleteTokenById = async (id, transaction) => {
    let options = {};
    if (transaction){
        options['transaction'] = transaction;
    }
    options['where'] = {
        id: id
    };
    await Token.destroy(options);
}

const updateTokenById = async (id, updatedObject, transaction) => {
    let options = {
        where: { id: id }
    };
    if (transaction){
        options['transaction'] = transaction;
    }
    return await Token.update(
        updatedObject,
        options
    );
}

module.exports = {
    saveToken,
    getTokenByUser,
    deleteTokenById,
    updateTokenById
}
