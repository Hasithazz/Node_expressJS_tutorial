const User = require('../models/user');
const bcrypt = require('bcryptjs')


exports.getLogin = (req, res, next) => {
    console.log(req.session);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn,
        errorMsg: req.flash('error')
    });
};

exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;

    User.findOne({email: email}).then((user) => {

        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password).then(result => {
            if (result) {
                req.session.user = user;
                req.session.isLoggedIn = true;
                console.log(user);
                return req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                })
            }
            return res.redirect('/login');
        }).catch((err) => {
            console.log(err)
            res.redirect('/login');
        });
    });

};

exports.postLogOut = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.postSignup = (req, res, next) => {
    const {email, password, confirmPassword} = req.body;
    User.findOne({email: email}).then((user) => {
        if (user) {
            console.log('User already exists');
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12).then(hashPassword => {
            const newUser = new User({
                email: email, password: hashPassword,
            });
            return newUser.save();
        }).then(result => {
            res.redirect('/login');
        })
    }).catch((err) => {
        console.log(err)
    })
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup', pageTitle: 'Signup', isAuthenticated: false
    });
};