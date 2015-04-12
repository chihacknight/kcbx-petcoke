module.exports = {
  getSmsSubscribers: function(callback) {
    return callback(null, process.env.TEST_RECIPIENTS)
  }
}