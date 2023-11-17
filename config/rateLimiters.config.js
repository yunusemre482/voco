const rateLimit = require('express-rate-limit');


const configureRateLimit = (app) => {
    const limiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 100,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    app.use(limiter);
};

module.exports = configureRateLimit;
