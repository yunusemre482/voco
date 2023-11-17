const cors = require('cors');
const {
    HOST,
    PRODUCTION_SERVER_URL,
    DEVELOPMENT_SERVER_URL,
    FRONTEND_URL,
} = require('../constants/environment');

const configureCors = (app) => {
    app.use(
        cors({
            origin: [
                `https://${HOST}`,
                `http://${HOST}`,
                PRODUCTION_SERVER_URL,
                DEVELOPMENT_SERVER_URL,
                `${HOST}`,
                'http://localhost:3000',
                'http://localhost:5000',
                FRONTEND_URL,
            ],
            methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
            credentials: true, // enable set cookie
        })
    );
};
module.exports = configureCors;
