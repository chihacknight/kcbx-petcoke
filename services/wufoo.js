module.exports = {
  getSmsSubscribers: function() {
    return process.env.TEST_RECIPIENTS
  }
}