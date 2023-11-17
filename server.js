const express = require('express');
const { PORT } = require('./constants/environment');
const configureApp = require('./config');
const connectDB = require('./config/db.config');
const initializeRoutes = require('./routes');


const startServer = async () => {
    const app = express();

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
        // Configure the app: add loggers, cors, swagger, passport, rate limiters
        configureApp(app);
    });

    // Connect to the database
    await connectDB();

    // Initialize routes
    initializeRoutes(app);
};

// Start the server
startServer();