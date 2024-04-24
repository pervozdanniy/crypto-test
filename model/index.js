const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config");

const db = {};
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        logging: false,
        dialect: dbConfig.DIALECT,
        operatorsAliases: 0,
        pool: dbConfig.POOL
    }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.token = require("./token.model.js")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.model")(sequelize, Sequelize);

// USER X ROLES
db.role.belongsToMany(db.user, {
        through: "user_roles",
        foreignKey: "role_id",
        otherKey: "user_id"
});
db.user.belongsToMany(db.role, {
        through: "user_roles",
        foreignKey: "user_id",
        otherKey: "role_id"
});

// USER x TOKEN
db.user.hasMany(db.token, {foreignKey: 'userId'});
db.token.belongsTo(db.user, {foreignKey: 'userId'});

module.exports = db;