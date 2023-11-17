const dotenv = require('dotenv');

dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    PRODUCTION_SERVER_URL: process.env.PRODUCTION_SERVER_URL,
    DEVELOPMENT_SERVER_URL: process.env.DEVELOPMENT_SERVER_URL,

    API_PREFIX: process.env.API_PREFIX,
    HOST: process.env.HOST,
    FRONTEND_URL: process.env.FRONTEND_URL,

    /**
     * Database configuration
     */
    MONGO_URI: process.env.MONGO_URI,
    DB_USER_NAME: process.env.DB_USER_NAME,
    DB_USER_PASSWORD: process.env.DB_USER_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_CLUSTER_URL: process.env.DB_CLUSTER_URL,

    /**
     * Email configuration
     */
    SENDER_EMAIL: process.env.SENDER_EMAIL,
    SENDER_EMAIL_PASSWORD: process.env.SENDER_EMAIL_PASSWORD,

    /**
     * JWT configuration
     */
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    RESET_PASSWORD_SECRET: process.env.RESET_PASSWORD_SECRET,
};