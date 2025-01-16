import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import initializeDB from './db.js';

const router = express.Router();

passport.use(new GoogleStrategy({
   clientID: process.env['GOOGLE_CLIENT_ID'],
   clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
   callbackURL: 'http://localhost:8080/oauth2/redirect/google',
   scope: ['profile', 'email']
}, async function(accessToken, refreshToken, profile, done) {
   try {
       const db = await initializeDB();
       
       const cred = await db.collection('federated_credentials').findOne({
           provider: 'google',
           subject: profile.id
       });
       
       if (!cred) {
           // 새 사용자 생성
           const result = await db.collection('users').insertOne({
               name: profile.displayName,
               nickname: "기본닉네임"
           });
           
           const id = result.insertedId;
           
           await db.collection('federated_credentials').insertOne({
               user_id: id,
               provider: 'google',
               subject: profile.id
           });
           
           const user = {
               id: id.toString(),
               name: profile.displayName,
               nickname: "기본닉네임"
           };
           return done(null, user);
       }
       
       // 기존 사용자 찾기
       const user = await db.collection('users').findOne({ _id: cred.user_id });
       if (!user) {
           return done(null, false);
       }

       user.id = user._id.toString();
       return done(null, user);
       
   } catch (err) {
       return done(err)
   }
}));

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/login', function(req, res, next) {
   res.render('login');
});

router.get('/oauth2/redirect/google', passport.authenticate('google'), (req, res) => {
  res.redirect('http://localhost:3000');
});

router.get('/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
      const { id, name, nickname } = req.user;
      return res.json({ 
        user: { 
          id,
          name, 
          nickname
        } 
      });
    }
    
    res.status(401).json({ message: "Not authenticated" });
});

router.post('/logout', function(req, res, next) {
   req.logout(function(err) {
       if (err) { return next(err); }
       res.redirect('/');
   });
});

passport.serializeUser(function(user, cb) {
   process.nextTick(function() {
       cb(null, { 
           id: user.id,
           name: user.name,
           nickname: user.nickname
       });
   });
});

passport.deserializeUser(function(user, cb) {
   process.nextTick(function() {
       return cb(null, user);
   });
});

export default router;