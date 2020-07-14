const express = require("express");
const fileUpload = require ("express-fileupload");
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const uploadRoutes = require('./routes/upload-routes');
const keys = require('./config/keys');
const connection = require('./config/database');

const PORT = 5000;
const app = express();

//---------------------------------------set view engine
app.set('view engine', 'ejs');

//---------------------------------------midleware

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport-setup');
app.use(fileUpload());

//----------------------------------------connect to mongodb and save sessions
const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}))

//---------------------------------------home route handeling
app.get("/", (req,res) => {
    res.render('home', { user: req.user });
});

//---------------------------------------set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/upload', uploadRoutes);


app.listen (PORT, ()=>{
  console.log(`listening on port ${PORT}`);
});