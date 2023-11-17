const { USER_ROLES } = require('../constants/userRoles');
const User = require('../models/User');
const Token = require('../models/Token');
const moment = require('moment');

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require('../services/email.service');


const {
  generateJWTToken,
  generateRefreshToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  hashPassword,
  isPasswordMatch,
  verifyJWTToken,
} = require('../utils/auth.utils');

const { TOKEN_TYPES } = require('../constants');
const { FRONTEND_URL } = require('../constants/environment');


const login = async (req, res) => {
  const { username, password } = req.body;
  try {


    // user can login with username or password check with regex in datbase and then login 
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });
    
    if (!user) {
      return res
        .status(400)
        .json({ message: 'User does not exist', success: false });
    }

    const isValid = isPasswordMatch(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        message: 'Invalid credentials : Passwords does not match',
        success: false,
      });
    }

    const accessToken = generateJWTToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({
      id: user._id,
      email: user.email,
    });

    return res.status(200).json({
      message: 'User logged in successfully',
      accessToken, refreshToken,
      user: user.toJSON()
    });
  } catch (err) {
    return res.status(400).json({ message: "an Error occurred", success: false });
  }
};

const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  console.log(req.body);

  try {
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res
        .status(400)
        .json({ message: 'User already exists', success: false });
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: USER_ROLES.CUSTOMER,
    });

    const token = generateJWTToken({ id: user._id, email: user.email });

    await sendVerificationEmail({ to: email, token: token });

    const savedUser = await user.save();

    return res.status(200).json({
      message: 'User created successfully',
      user: savedUser.toJSON(),
    });
  } catch (err) {
    return res.status(400).json({ message: err, success: false });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ message: 'Refresh token is required', success: false });
  }

  const decoded = verifyJWTToken(refreshToken);

  if (decoded instanceof Error) {
    return res.status(400).json({
      message: `
        Token is invalid or expired, please request a new one`,
      success: false,
      decoded,
    });
  }

  const { userId } = decoded;

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(400)
      .json({ message: 'User does not exist', success: false });
  }

  const accessToken = generateJWTToken({ id: user._id, email: user.email });
  const refreshTokenNew = generateRefreshToken({
    id: user._id,
    email: user.email,
  });

  return res.status(200).json({
    message: 'User logged in successfully',
    success: true,
    data: { accessToken, refreshToken: refreshTokenNew, user: user.toJSON() },
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'User does not exist', success: false });
    }

    const resetToken = generatePasswordResetToken({
      userId: user._id,
      email: user.email,
    });
    const token = new Token({
      user: user._id,
      token: resetToken,
      type: 'passwordReset',
      expires: moment().add(1, 'hours').toDate(),
    });

    await sendPasswordResetEmail({ to: email, token: resetToken });
    await token.save();

    return res.status(200).json({
      message: 'Password reset email sent successfully',
      success: true,
    });
  } catch (error) {
    return res.status(400).json({ message: error, success: false });
  }
};

const resetPassword = async (req, res) => {
  const token = req.params.token;

  const { password } = req.body;

  try {
    const isTokenExist = await Token.findOne({
      token,
      type: TOKEN_TYPES.PASSWORD_RESET,
    });

    if (!isTokenExist) {
      return res
        .status(400)
        .json({ message: 'Token does not exist', success: false });
    }

    // check for token expiry

    if (isTokenExist.expires < moment().toDate()) {
      return res.status(400).json({ message: 'Token expired', success: false });
    }

    const decoded = verifyPasswordResetToken(token);

    if (decoded instanceof Error) {
      return res.status(400).json({
        message: `
        Token is invalid or expired, please request a new one`,
        success: false,
        decoded,
      });
    }

    const user = await User.findById(isTokenExist.user);

    if (!user) {
      return res
        .status(400)
        .json({ message: 'User does not exist', success: false });
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;

    await user.save();
  } catch (error) {
    return res.status(400).json({ message: error, success: false });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.body;

  console.log(token);

  if (!token) {
    return res
      .status(400)
      .json({ message: 'Token is required', success: false });
  }

  const decoded = verifyJWTToken(token);

  console.log(decoded);

  if (decoded instanceof Error || decoded === false) {
    return res.status(400).json({
      message: `
        Token is invalid or expired, please request a new one`,
      success: false,
      decoded,
    });
  }

  const { userId } = decoded;

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(400)
      .json({ message: 'User does not exist', success: false });
  }

  user.mailConfirmed = true;

  await user.save();

  return res
    .status(200)
    .json({ message: 'User verified successfully', success: true });
};

const resendVerificationEmail = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ message: 'User id is required', success: false });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(400)
      .json({ message: 'User does not exist', success: false });
  }

  if (user.mailConfirmed) {
    return res
      .status(400)
      .json({ message: 'User already verified', success: false });
  }

  // TODO: send verification email to the user again
  return res
    .status(200)
    .json({ message: 'Verification email sent successfully', success: true });
};

// Controller for the routes that handle the success redirects from all 4 passport strategies
const passportLoginSuccess = async (req, res) => {
  return res.redirect(`${FRONTEND_URL}/login?login=success&id=${req.user._id}`);
};

// Controller for the routes that handle the failure redirects from all 4 passport strategies
const passportLoginFailure = async (req, res) => {
  const errorMsg = req.flash('error')[0];

  return res.redirect(
    `${FRONTEND_URL}/login?login=failed&errorCode=${errorMsg}`
  );
};

module.exports = {
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  passportLoginSuccess,
  passportLoginFailure,
};