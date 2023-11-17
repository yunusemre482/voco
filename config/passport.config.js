const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    ACCESS_TOKEN_SECRET,
} = require('../constants/environment');

function serializeUser(user, done) {
    done(null, user);
}

function deserializeUser(user, done) {
    done(null, user);
}

function configureJwtStrategy(passport) {
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: ACCESS_TOKEN_SECRET,
            },
            async (jwtPayload, done) => {
                try {
                    const user = await User.findById(jwtPayload.id);
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );
}

function configureGoogleStrategy(passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: 'http://localhost:5000/api/v1/auth/google/callback',
            },
            (accessToken, refreshToken, profile, done) => {
                // Handle Google authentication logic here
                console.log(profile);
                done(null, profile);
            }
        )
    );
}

function configureFacebookStrategy(passport) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: FACEBOOK_APP_ID,
                clientSecret: FACEBOOK_APP_SECRET,
                callbackURL: 'http://localhost:5000/api/v1/auth/facebook/callback',
            },
            (accessToken, refreshToken, profile, done) => {
                // Handle Facebook authentication logic here
                console.log(profile);
                done(null, profile);
            }
        )
    );
}

function configurePassport(passport) {
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    configureJwtStrategy(passport);
    configureGoogleStrategy(passport);
    configureFacebookStrategy(passport);
}

module.exports = configurePassport;
