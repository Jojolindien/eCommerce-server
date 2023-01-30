const admin = require("../firebase");
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
  // console.log("HEADER : "+req.headers.authtoken);
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    // console.log("FIREBAS USER IN middleware AUTHCHECK : ", firebaseUser);
    req.user = firebaseUser;
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      err: "Invalid or expired token",
    });
  }
  next();
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email: email }).exec();
  // console.log(adminUser.role);
  if (adminUser.role !== "admin") {
    res.status(403).json({ err: "admin resource. Acces denied" });
  } else {
    next();
  }
};
