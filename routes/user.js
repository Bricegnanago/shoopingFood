var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy  = require('passport-local').Strategy
var csrf = require('csurf') //On appelle le modules
var Product = require('../models/product')


var csrfProtection  = csrf()
router.use(csrfProtection)
/* GET users listing. */

//obtenir cette routes si l'utilisateur est connecté
router.get('/profile', isLoggedIn,(req, res, next) => {
  res.render('user/profile')
})

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout()
  res.redirect('/')
})


//utiliser cette route (localhost) tant que nous sommes deconnecté
router.use('/', notLoggedIn,(req, res, next) => {
  next();
})

router.get('/signup', (req, res, next) => {
  var messages = req.flash('error')
  res.render('user/signup', {
    csrfToken : req.csrfToken(), messages : messages, hasErrors : messages.length > 0 })
  })

router.post('/signup', passport.authenticate('local.signup',{
  successRedirect : '/user/profile',
  failureRedirect : '/user/signup',
  failureFlash : true
}))

router.get('/signin', (req, res, next) => {
  var messages = req.flash('error')
  res.render('user/signin', {
    csrfToken : req.csrfToken(), messages : messages, hasErrors : messages.length > 0 })
})

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect : '/user/profile',
  failureRedirect : '/user/signin',
  failureFlash : true
}))


module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/')
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next()
  }
  res.redirect('/')
}