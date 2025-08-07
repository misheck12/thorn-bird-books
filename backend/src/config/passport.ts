import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User';

export const configurePassport = (): void => {
  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id);
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error as Error, false);
        }
      }
    )
  );

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists with this Google ID
            let user = await User.findOne({
              'socialAccounts.google.id': profile.id,
            });

            if (user) {
              return done(null, user);
            }

            // Check if user exists with the same email
            user = await User.findOne({
              email: profile.emails?.[0]?.value,
            });

            if (user) {
              // Link Google account to existing user
              user.socialAccounts = {
                ...user.socialAccounts,
                google: {
                  id: profile.id,
                  email: profile.emails?.[0]?.value || '',
                },
              };
              await user.save();
              return done(null, user);
            }

            // Create new user
            user = new User({
              email: profile.emails?.[0]?.value,
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              isEmailVerified: true,
              avatar: profile.photos?.[0]?.value,
              socialAccounts: {
                google: {
                  id: profile.id,
                  email: profile.emails?.[0]?.value || '',
                },
              },
            });

            await user.save();
            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  }

  // Facebook OAuth Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: '/api/auth/facebook/callback',
          profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists with this Facebook ID
            let user = await User.findOne({
              'socialAccounts.facebook.id': profile.id,
            });

            if (user) {
              return done(null, user);
            }

            // Check if user exists with the same email
            user = await User.findOne({
              email: profile.emails?.[0]?.value,
            });

            if (user) {
              // Link Facebook account to existing user
              user.socialAccounts = {
                ...user.socialAccounts,
                facebook: {
                  id: profile.id,
                  email: profile.emails?.[0]?.value || '',
                },
              };
              await user.save();
              return done(null, user);
            }

            // Create new user
            user = new User({
              email: profile.emails?.[0]?.value,
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              isEmailVerified: true,
              avatar: profile.photos?.[0]?.value,
              socialAccounts: {
                facebook: {
                  id: profile.id,
                  email: profile.emails?.[0]?.value || '',
                },
              },
            });

            await user.save();
            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  }
};