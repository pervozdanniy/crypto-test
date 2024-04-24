const db = require("../model");
const {ROLES} = require('../util/enum/ROLE');
const User = db.user;
const Role = db.role;

const saveUser = async (userObject, transaction) => {
    let options = {};
    if (transaction){
        options['transaction'] = transaction;
    }
    return await User.create(userObject, options);
}

const getUserById = async (id) => {
    return await User.findOne({
        where: {
            id: id
        },
    });
}

const getUserIdById = async (id) => {
    return await User.findOne({
        where: {
            id: id
        },
        attributes: ['id']
    });
}

const getUserIdByEmail = async (email) => {
    return await User.findOne({
        where: {
            email: email
        },
        attributes: ['id']
    });
}

const getUserByEmail = async (email) => {
    return await User.findOne({
        where: {
            email: email
        }
    });
}

const getAdmins = async () => {
    return await User.findAll({
        attributes: ['email'],
        include: {
            model: Role,
            where: {
                name: ROLES.ROLE_ADMIN
            }
        }
    });
}

const getAllUsers = async () => {
    return await User.findAll({
        order: [
            ['id'],
        ],
    });
}

const updateUserById = async (id, updatedObject, transaction) => {
    let options = {};
    if (transaction){
        options['transaction'] = transaction;
    }
    options['where'] = {
        id: id
    };
    return await User.update(
        updatedObject,
        options
    );
}

module.exports = {
    saveUser,
    getUserById,
    getUserIdById,
    getUserByEmail,
    getAdmins,
    getAllUsers,
    updateUserById,
    getUserIdByEmail
}
