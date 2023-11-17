const { Router } = require('express');
const authRoutes = require('./auth.routes');
const { API_PREFIX } = require('../constants/environment');


function initial(app) {
    /**
    * @openapi
    * /healthcheck:
    *  get:
    *     tags:
    *     - Healthcheck
    *     description: Responds if the app is up and running
    *     responses:
    *       200:
    *         description: App is up and running
    */
    app.get(`${API_PREFIX}/healthcheck`, (req, res) => res.status(200).send('OK'));


    const routes = new Router();

    routes.use('/auth', authRoutes);

    app.use(`${API_PREFIX}`, routes);

    app.all('*', (req, res, next) => {
        return res.status(404).json({
            message: `Can't find ${req.originalUrl} on this server!`,
        });
    });
    // app.use('/api/v2', routerV2);
    // app.all('*', (req, res, next) => {
    //     const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    //     next(err);
    // });
    // app.use(globalErrorMiddleware)

}


module.exports = initial;