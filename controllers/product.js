const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    //ajout du slug dans le body
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(400).send("Create product failed");
  }
};

exports.listAll = async (req, res) => {
  try {
    console.log("COUNT PRODUCT GET ALL : ", req.params.count);
    const products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subCategories")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).send("Get all products failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product deleting failed");
  }
};

exports.read = async (req, res) => {
  console.log("REQUETE READ", req.body);
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subCategories")
    .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  console.log("REQUETE", req.body);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    //new: true permet de retourner le nouvel objet mis à jour, sinon retourne l'ancien dans le res.json
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    console.log("UPDATING", updated);
    res.json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATE ERROR : ", err);
    return res.status(400).json({ err: err.message });
  }
};

//Without pagination
// exports.list = async (req, res) => {
//   try {
//     //createdAt/updatedAt, desc/asc, 3
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subCategories")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

//With Pagination
exports.list = async (req, res) => {
  try {
    //createdAt/updatedAt, desc/asc, 3
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subCategories")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();

  const { star } = req.body;

  // who is updating ?
  // check if currently logged in user have already added rating to this product ?

  let existingRatingIbject = product.ratings.find(
    (ele) => ele.postedBy.toString() === user._id.toString()
  );

  //if user haven't left rating yet, push it
  //if user have already rating, update it
  if (existingRatingIbject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star: star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    console.log("ratingAdded", ratingAdded);
    res.json(ratingAdded);
  } else {
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingIbject },
      },
      { $set: { "ratings.$.star": star } },
      { new: true }
    ).exec();
    console.log("RATING UPDATED :", ratingUpdated);
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const related = await Product.find({
    //ne = not including
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(1)
    .populate("category")
    .populate("subCategories")
    .populate("ratings.postedBy")
    .exec();
  //exemple si on ne veut pas certaine donnée
  // .populate('postedBy', '-password')
  res.json(related);
};
