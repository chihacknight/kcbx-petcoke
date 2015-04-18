var cnx = process.env.DATABASE_URL
  , Sequelize = require('sequelize')
  ;

client = new Sequelize(cnx, {
  define: {
    underscored: true
  }
})

module.exports = {
  "module": Sequelize,
  client: client
};
