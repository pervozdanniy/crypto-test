const db = require("../model");
const Role = db.role;
const User = db.user;


const saveRolesInBulk = async (roleList) => {
    return await Role.bulkCreate(roleList);
}
const getAllRolesByName = async (roleList) => {
    return await Role.findAll({
        where: {
            name: roleList
        },
        attributes: ['id', 'name']
    });
}

const getAllRoleOnlyName = async () => {
    return await Role.findAll({
        attributes: ['name']
    });
}

const assignRoleToUser = async (userId, roleName, transaction) => {
    let options = {}
    if (transaction){
        options['transaction'] = transaction;
    }

    const role = await Role.findOne({
        where: {
            name: roleName
        }
    });

    if (role) {
        await role.addUser(userId, options);
    } else {
        throw new Error('Role not found!');
    }
}

const getRolesByUserId = async (userId) => {
    const roleObjects = await Role.findAll({
        include: [{
            model: User,
            where: {
                id: userId
            }
        }],
        attributes: ['name']
    });
    return roleObjects.map(roleObject => roleObject.name);
}

module.exports = {
    getAllRolesByName,
    getAllRoleOnlyName,
    assignRoleToUser,
    getRolesByUserId,
    saveRolesInBulk
}