module.exports = (sequelize, Sequelize) => {
    return sequelize.define("user", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            isEmailVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            emailVerificationTime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            passwordUpdatedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        },
        {
            tableName: 'users',
            underscored: true,
        });
};