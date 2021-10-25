const mongoose = require('mongoose');
const connectionString = require('./connectionstring')

const options = {
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true
}

mongoose.connect(connectionString,
  options,
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Connexion to DB : OK');
    }
  }
)
