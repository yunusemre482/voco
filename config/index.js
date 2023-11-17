const express = require('express');
const passport = require('passport');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morganBody = require('morgan-body');
const path = require('path');

const configureCors = require('./cors.config');
const configureLogger = require('./logger.config');
const configureSwagger = require('./swagger.config');
const configurePassport = require('./passport.config');
const configureRateLimiters = require('./rateLimiters.config');


const configureApp = (app) => {
    // NOTE: Use session-based authentication if needed
    // configureSession(app);
    // app.use(passport.session());


    // Middlewares
    app.use(helmet());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize())
    app.use(compression());

    if (process.env.NODE_ENV === 'development') {
        morganBody(app);
    }

    // Serve public files in the 'public' folder from the parent directory
    app.use('/public', express.static(path.join(__dirname, '../public')));

    // Configure Passport
    configurePassport(passport);

    // Configure CORS, logging, Swagger, and rate limiters
    configureCors(app);
    configureLogger(app);
    configureSwagger(app);
    configureRateLimiters(app);
}


module.exports = configureApp;