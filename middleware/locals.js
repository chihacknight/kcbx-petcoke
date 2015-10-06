var async = require('async');
var i18next = require('i18next');

module.exports = function(req, res, next) {

    var lng = i18next.lng();
    
    /**
     * This ugliness is to deal with i18next defaulting to 'dev' as the language 
     * when unable to store a cookie (ie. web crawlers).
     */
    async.waterfall([
        function(nextAsync) {
            if (lng === 'dev') {
                return i18next.setLng('en-US', function(err, t){
                    nextAsync(err)
                });
            }
            return nextAsync(null);
        },
        
        function(nextAsync) {
            res.locals.currentLng = i18next.lng();
            res.locals.languageIsEnglish = (i18next.lng() === 'en-US')
            nextAsync(null);
        }
    ], next)
}
