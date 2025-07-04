const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { findUserByUsername, findUserById } = require('./models/userModel');
const bcrypt = require('bcryptjs');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const memberRouter = require('./routes/member');
const messageRouter = require('./routes/message');



require('dotenv').config();


const app = express();

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false
}));

//Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define Local Strategy
passport.use(new LocalStrategy({ usernameField: 'username' }, 
  async (username, password, done) => {
    const user = await findUserByUsername(username);
    if (!user) return done(null, false, { message: 'Incorrect email.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  }
));

// Serialize & Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await findUserById(id);  
  done(null, user);
});


// Routes
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', memberRouter);
app.use('/', messageRouter);





// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dead Poet Society app running on http://localhost:${PORT}`);
});
