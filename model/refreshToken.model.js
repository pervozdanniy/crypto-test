module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refresh_token", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            refreshToken: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            payload: {
                type: Sequelize.JSONB,
                allowNull: false
            },
            expireAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            },
        },
        {
            tableName: 'refresh_tokens',
            underscored: true
        });
    return RefreshToken;
};