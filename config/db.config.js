const dbConfig = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    DIALECT: process.env.DB_DIALECT,
    POOL: {
        MAX: +process.env.DB_MAX_POOL,
        MIN: +process.env.DB_MIN_POOL,
        ACQUIRE: +process.env.DB_ACQUIRE_POOL,
        IDLE: +process.env.DB_IDLE_POOL
    }
};

module.exports = dbConfig;