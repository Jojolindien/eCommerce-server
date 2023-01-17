const Category = require("../models/category");
const SubCategory = require("../models/subcategory");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name: name,
      slug: slugify(name),
    }).save();
    // console.log(category)
    res.json(category);
  } catch (err) {
    // console.log(err);
    res.status(400).send("Create category failed");
  }
};

exports.list = async (req, res) => {
  const listCategories = await Category.find({}).sort({ createdAt: -1 }).exec();
  res.json(listCategories);
};

exports.read = async (req, res) => {
  const slugCategory = await Category.findOne({ slug: req.params.slug }).exec();
  res.json(slugCategory);
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      {
        name: name,
        slug: slugify(name),
      },
      { new: false }
    ).exec();
    res.json("Category " + updated.name + " has been updated to " + name);
  } catch (err) {
    res.status(400).send("Updating category failed");
  }
};

exports.remove = async (req, res) => {
  try {
    // if (!req.params.slug) {
    //   throw new Error();
    // }
    const deleted = await Category.findOneAndDelete({
      slug: req.params.slug,
    }).exec();
    if (!deleted) {
      throw new Error();
    }
    res.json("Category " + req.params.slug + " has been deleted");
  } catch (err) {
    res.status(400).send("Deleting category failed");
  }
};

exports.getSubCategories = (req, res) => {
  try {
    //
    SubCategory.find({ parent: req.params._id }).exec((err, subCategories) => {
      if (err) {
        console.log(err);
        throw new Error(err);
      }
      res.json(subCategories);
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("getSubCategories category failed");
  }
};
