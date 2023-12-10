const express = require('express');
const session = require('express-session');
const passport = require('passport');
const db = require('./models');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (username, password, done) => {
      db.User.findOne({ where: { username: username } })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          user.validPassword(password).then((isValid) => {
            if (!isValid) {
              return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
          });
        })
        .catch((err) => done(err));
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findByPk(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

// Routes
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Sync database and start the server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
