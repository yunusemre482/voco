const mongoose = require('mongoose');
const { USER_ROLES } = require('../constants/userRoles');
const { GENDER } = require('../constants')

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *           minLength: 3
 *           maxLength: 50
 *         password:
 *           type: string
 *           description: The password of the user.
 *           minLength: 8
 *           maxLength: 1024
 *         email:
 *           type: string
 *           description: The email address of the user.
 *           maxLength: 255
 *         age:
 *           type: number
 *           description: The age of the user.
 *           minimum: 0
 *           maximum: 120
 *         gender:
 *           type: string
 *           description: The gender of the user.
 *           enum:
 *             - FEMALE
 *             - MALE
 *             - OTHER
 *         profileImage:
 *           type: string
 *           description: URL of the user's profile image (optional).
 *         role:
 *           type: string
 *           description: The role of the user.
 *           enum:
 *             - CUSTOMER
 *             - RESTAURANT_OWNER
 *             - ADMIN
 *             - SUPER_ADMIN
 *           default: CUSTOMER
 *         addresses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               addressType:
 *                 type: string
 *                 description: Type of the address.
 *               city:
 *                 type: string
 *                 description: City of the address.
 *               district:
 *                 type: string
 *                 description: District of the address.
 *               street:
 *                 type: string
 *                 description: Street of the address.
 *               latitude:
 *                 type: number
 *                 description: Latitude of the address.
 *               longitude:
 *                 type: number
 *                 description: Longitude of the address.
 *           description: Addresses associated with the user.
 *       required:
 *         - username
 *         - password
 *         - email
 *         - role
 *       example:
 *         username: john_doe
 *         password: securepassword
 *         email: john.doe@example.com
 *         age: 30
 *         gender: MALE
 *         profileImage: https://example.com/profile.jpg
 *         role: CUSTOMER
 *         addresses:
 *           - addressType: Home
 *             city: Cityville
 *             district: Downtown
 *             street: 123 Main St
 *             latitude: 40.7128
 *             longitude: -74.0060
 *           - addressType: Work
 *             city: Worktown
 *             district: Business District
 *             street: 456 Business Blvd
 *             latitude: 40.7128
 *             longitude: -73.9352
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
  },
  age: {
    type: Number,
    min: 0,
    max: 120,
  },
  gender: {
    type: String,
    enum: [GENDER.FEMALE, GENDER.MALE, GENDER.OTHER],
    required: false
  },
  profileImage: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: [USER_ROLES.CUSTOMER, USER_ROLES.RESTAURANT_OWNER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    default: USER_ROLES.CUSTOMER,
  },
  addresses: [
    {
      addressType: String,
      city: String,
      district: String,
      street: String,
      latitude: Number,
      longitude: Number
    }
  ]
}, {
  timestamps: true,
});

userSchema.methods.toJSON = function () {
  var obj = this.toObject(); //or var obj = this;
  delete obj.password;
  return obj;
};


const User = mongoose.model('User', userSchema);

module.exports = User;