
var admin = require("firebase-admin");

var serviceAccount = require("../config/ecommerce-d8813-firebase-adminsdk-30zct-0c2083c57c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports = admin;