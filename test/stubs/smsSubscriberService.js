module.exports = {
  getSubscribers: function(cb) {
    return cb( null, [
      {
        rowid: 1001,
        phone: '3125555555',
        createdAt: '2015-04-26 20:08:45'
      },{
        rowid: 1002,
        phone: '3125555556',
        createdAt: '2015-04-23 20:08:45'
      },{
        rowid: 1003,
        phone: '3125555557',
        createdAt: '2015-04-22 20:08:45'
      }
    ]);
  }
}
