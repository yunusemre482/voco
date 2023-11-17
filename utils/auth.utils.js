const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    RESET_PASSWORD_SECRET,
} = require('../constants/environment');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    return passwordHash;
};

const isPasswordMatch = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

const generateJWTToken = (payload) => {
    const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    return token;
};

const verifyJWTToken = (token) => {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        return error;
    }
};

const generatePasswordResetToken = (payload) => {
    const token = jwt.sign(payload, RESET_PASSWORD_SECRET, { expiresIn: '1d' });
    return token;
};

const verifyPasswordResetToken = (token) => {
    try {
        const decoded = jwt.verify(token, RESET_PASSWORD_SECRET);
        return decoded;
    } catch (error) {
        return error;
    }
};

const generateRefreshToken = (payload) => {
    const token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return token;
};

const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        return error;
    }
};

const encryptPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

module.exports = {
    hashPassword,
    isPasswordMatch,
    generateJWTToken,
    verifyJWTToken,
    generatePasswordResetToken,
    verifyPasswordResetToken,
    generateRefreshToken,
    verifyRefreshToken,
    encryptPassword,
};
