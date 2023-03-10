const cloudinary = require("cloudinary");

//config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
  let result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: "auto", //jpg png ...
  });

  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};

exports.remove = (req, res) => {
  console.log("removing");
  let image_id = req.body.image_id;
  console.log(image_id);
  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) {
      return res.json({ success: false, err }).status(400);
    }
    console.log(result)
    res.status(200).send("Image succeffully deleted", result);
  });
};
