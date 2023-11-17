const mongoose = require('mongoose');
const { TOKEN_TYPES } = require('../constants');
/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the associated user
 *         token:
 *           type: string
 *           description: The token value
 *         type:
 *           type: string
 *           enum: ['emailVerification', 'passwordReset']
 *           description: The type of the token
 *         expires:
 *           type: string
 *           format: date-time
 *           description: The expiration date of the token
 *       required:
 *         - user
 *         - token
 *         - type
 *         - expires
 */
const TokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: [TOKEN_TYPES.EMAIL_VERIFICATION, TOKEN_TYPES.PASSWORD_RESET],
            required: true,
        },
        expires: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Token', TokenSchema);
