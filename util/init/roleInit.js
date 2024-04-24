const {ROLES} = require('../enum/ROLE');
const {getAllRoleOnlyName, saveRolesInBulk} = require('../../repository/roleRepository');

const init = async () => {
    const rolesToSave = [];
    let dbRoles = await getAllRoleOnlyName();
    dbRoles = dbRoles.map((role) => role.name);

    Object.keys(ROLES).map((key, value) => {
        if (dbRoles == null || !dbRoles.includes(key)) {
            rolesToSave.push({name: key});
        }
    });

    if (rolesToSave.length > 0) {
        try{
            await saveRolesInBulk(rolesToSave);
            console.log("::: ALL NEW " + rolesToSave.length + " ROLES SAVED :::");
        }catch (e){
            console.log(e);
        }
    } else {
        console.log("::: ALL ROLES ALREADY SAVED IN DATABASE :::");
    }
};

module.exports = {
    init
}