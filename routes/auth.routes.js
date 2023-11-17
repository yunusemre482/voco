const { Router } = require('express');
const passport = require('passport');

const {
    login,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    passportLoginSuccess,
    passportLoginFailure,
} = require('../controllers/auth.controller.js');

const { API_PREFIX } = require('../constants/environment');

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Login
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: login
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register
 *     description: Register
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: register user
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: jhondoe45
 *               required: true
 *             email:
 *               type: string
 *               example: test@example.com 
 *               required: true   
 *             password:
 *               type: string
 *               example: 12345678
 *               required: true
 *             confirmPassword:
 *                type: string
 *                example: 12345678
 *                required: true
 *     responses:
 *       201:
 *         description: Register successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     description: Forgot Password
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: forgot-password
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: test@example.com 
 *               required: true   
 *     responses:
 *       200:
 *         description: Forgot Password successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post(
    '/forgot-password',
    forgotPassword
);

/**
 * @swagger
 *  /auth/reset-password/{token}:
 *   post:
 *     summary: Reset Password
 *     description: Change user old password with new password
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         type: string
 *         example: 1adlkasşdolfbasdf7asdfjahsdfkadsf
 *         description: The token for reset password
 *     responses:
 *       200:
 *         description: Forgot Password successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post('/reset-password/:token', resetPassword);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   post:
 *     summary: Verify Email
 *     description: Verify Email
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         type: string
 *         example: 1adlkasşdolfbasdf7asdfjahsdfkadsf
 *         description: The token for verify email  
 *     responses:
 *       200:
 *         description: Verify Email successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post(
    '/verify-email/:token',
    verifyEmail
);

/**
 * @swagger
 * /auth/google:
 *  get:
 *    summary: Google OAuth
 *    description: Google OAuth
 *    tags:
 *      - Auth
 *    responses:
 *      200:
 *        description: Google OAuth successful
 *      400:
 *        description: Bad request
 */

// @desc login user using the google strategy
// @route GET /api/auth/google
// @access PUBLIC
router.route('/google').get(
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

// @desc redirect route for the passport google strategy
// @route GET /api/auth/google/redirect
// @access PUBLIC
router.route('/google/redirect').get(
    passport.authenticate('google', {
        successRedirect: `${API_PREFIX}'/auth/google/redirect/success'`,
        failureRedirect: `${API_PREFIX}'/auth/google/redirect/failure'`,
        failureFlash: true,
    })
);

// @desc redirect route for the passport google strategy
// @route GET /api/auth/google/redirect
// @access PUBLIC
router.route('/google/redirect/success').get(passportLoginSuccess);

// @desc redirect route for the passport google strategy
// @route GET /api/auth/google/redirect
// @access PUBLIC
router.route('/google/redirect/failure').get(passportLoginFailure);

module.exports = router;
