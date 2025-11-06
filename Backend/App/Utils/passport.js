const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require("../Models");
const Clients_Modal = db.Clients;


// We won't use sessions; but passport still needs serialize/deserialize if sessions used.
// For JWT flow we directly handle user in callback.
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async function(accessToken, refreshToken, profile, done) {
  try {
    // profile contains id, displayName, emails, photos
    const googleId = profile.id;

 const referTokenPrefix = Math.floor(1000 + Math.random() * 9000).toString(); // 1000-9999
const refer_token_suffix = Math.floor(1000 + Math.random() * 9000).toString(); // 1000-9999
const refer_token = referTokenPrefix + refer_token_suffix; // e.g. "48371234"

    let user = await Clients_Modal.findOne({ googleId });
    if (!user) {
      user = await Clients_Modal.create({
        googleId,
        refer_token,
        Email: profile.emails?.[0]?.value || '',
        FullName: profile.displayName || '',
        ActiveStatus:1,
      });
    } else {
      // optional: update fields
      user.Email = profile.emails?.[0]?.value || user.email;
      user.FullName = profile.displayName || user.name;
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
