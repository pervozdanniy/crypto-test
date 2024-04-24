module.exports = (sequelize, Sequelize) => {
    return sequelize.define("role", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        },
        {
            tableName: 'roles',
            underscored: true
        });
};