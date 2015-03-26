var cnx = process.env.DATABASE_URL
  , pg = require('pg')
  , client = new pg.Client(cnx)
  ; 

module.exports = client;
