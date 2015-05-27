var i18next = require('i18next');

module.exports = function(req, res, next) {
  res.locals.currentLng = i18next.lng();
  res.locals.languageIsEnglish = (i18next.lng() === 'en-US')
  next();
}