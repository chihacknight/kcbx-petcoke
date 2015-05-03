var env = process.env.NODE_ENV;
var auth = require("http-auth");

module.exports = {

/**
 * READ THIS!!
 *
 * This auth middlware is intended simply to keep bots out
 * of the staging environment. It is not an actual password system,
 * since anyone can see the credentials by browsing the github repo.
 */
  staging: auth.connect(auth.basic({
    realm: "Staging Enviroment (u:kcbx p:kcbx)"
  }, function(username, password, callback) {
    callback(username === 'kcbx' && password === 'kcbx')
  }))
}