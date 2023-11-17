const winston = require('winston');
const { MONGO_URI, NODE_ENV } = require('../constants/environment');
// To Log on MongoDB database use:
require('winston-mongodb');

const configureLogger = (db) => {
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    if (NODE_ENV === 'development') {
        winston.exceptions.handle(
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'uncaughtExceptions.log' })
        );

        winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                }),
                new winston.transports.File({
                    filename: 'info.log',
                    level: 'info',
                }),
            ],
        });
    } else {
        // Store logs on MongoDB database
        winston.createLogger({
            transports: [
                new winston.transports.File({
                    filename: 'info.log',
                    level: 'info',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                }),
                new winston.transports.MongoDB({
                    level: 'error',
                    db: MONGO_URI,
                    options: {
                        useUnifiedTopology: true,
                    },
                    collection: 'logs',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                }),
            ],
        });
    }

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
};

module.exports = configureLogger;
