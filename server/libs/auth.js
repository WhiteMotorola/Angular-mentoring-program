let passport = require('passport');
let User = require('../models/user.js');
let LocalStrategy = require('passport-local').Strategy;
let jwt = require('jsonwebtoken');

const config = require('../credentials').authProviders;

function generateAccessToken (req, res, next) {
  req.token = req.token ||  {};
  req.token.accessToken = jwt.sign({
    id: req.user.id
  }, config.local.appSecret, {
    expiresIn: config.local.tokenTime
  });
  next();
}

module.exports = function (app) {
  return {
    init: function () {
      passport.use(new LocalStrategy(
        function (username, password, done) {
          User.authenticate(username, password, done);
        }));
      app.use(passport.initialize());
    },

    registerRoutes: function () {
      app.post('/login', passport.authenticate('local', { session: false,
      scope: [] }), generateAccessToken, function (req, res, next) {
        res.status(200).json({
          user: req.user,
          token: req.token,
          expiresIn: config.local.tokenTime
        });
      });
    }
  }
}