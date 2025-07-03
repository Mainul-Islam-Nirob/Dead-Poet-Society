const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

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
  secret: process.env.SESSION_SECRET,           // 🔑 use a strong random secret in production
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


// Routes
app.use('/', indexRouter);
app.use('/', authRouter);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dead Poet Society app running on http://localhost:${PORT}`);
});
