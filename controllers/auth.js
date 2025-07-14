const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("67c1cf6c03cacef2faf6da18").then((user) => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        console.log(user);
        req.session.save((err) => {
            console.log(err);
            res.redirect('/');
        });
    });

};

exports.postLogOut = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });

};