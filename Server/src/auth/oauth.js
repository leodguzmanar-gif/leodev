import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { prisma } from '../db.js';
import { config } from '../config.js';

// Google
passport.use(
  new GoogleStrategy(
    config.oauth.google,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              username: profile.displayName || email.split('@')[0],
              oauthAccounts: {
                create: {
                  provider: 'google',
                  providerId: profile.id,
                },
              },
            },
          });
        } else {
          // Vincular cuenta si no existe
          await prisma.oAuthAccount.upsert({
            where: {
              provider_providerId: {
                provider: 'google',
                providerId: profile.id,
              },
            },
            create: {
              provider: 'google',
              providerId: profile.id,
              userId: user.id,
            },
            update: {},
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// GitHub
passport.use(
  new GitHubStrategy(
    config.oauth.github,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('GitHub no proporcionó email. Verifica los permisos.'));
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              username: profile.username || email.split('@')[0],
              oauthAccounts: {
                create: {
                  provider: 'github',
                  providerId: profile.id,
                },
              },
            },
          });
        } else {
          await prisma.oAuthAccount.upsert({
            where: {
              provider_providerId: {
                provider: 'github',
                providerId: profile.id,
              },
            },
            create: {
              provider: 'github',
              providerId: profile.id,
              userId: user.id,
            },
            update: {},
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});