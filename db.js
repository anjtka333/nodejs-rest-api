const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb+srv://anna:k8nkKscF6jegsrj@cluster0.lozlc.mongodb.net/db-contacts"
);

module.exports = mongoose;
