const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.User.findOne({ where: { username: username } });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isValidPassword = await user.validPassword(password);

      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
