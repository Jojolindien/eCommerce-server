const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  console.log(req.user);
  const { name, picture, email } = req.user;
  const user = await User.findOneAndUpdate(
    { email: email },
    { name: name, picture: picture },
    { new: true }
  );
  if (user) {
    console.log("USER UPDATED : ", user);
    res.json(user);
  } else {
    const newUser = await new User({ name, picture, email }).save();
    console.log("USER CREATED : ", newUser);
    res.json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) {
      throw new Error(err);
    }
    res.json(user);
  });
};

exports.home = (req, res) => {
  res.json({
    data: "hey you hit node api back end !",
  });
};
