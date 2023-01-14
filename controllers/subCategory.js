const SubCategory = require("../models/subcategory");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const category = await new SubCategory({
      name: name,
      parent,
      slug: slugify(name),
    }).save();
    // console.log(category)
    res.json(category);
  } catch (err) {
    // console.log(err);
    res.status(400).send("Create subCategory failed");
  }
};

exports.list = async (req, res) => {
  const listSubCategories = await SubCategory.find({}).sort({ createdAt: -1 }).exec();
  res.json(listSubCategories);
};

exports.read = async (req, res) => {
  const subSlugCategory = await SubCategory.findOne({ slug: req.params.slug }).exec();
  res.json(subSlugCategory);
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await SubCategory.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      {
        name: name,
        parent,
        slug: slugify(name),
      },
      { new: false }
    ).exec();
    res.json("Subcategory " + updated.name + " has been updated to " + name);
  } catch (err) {
    res.status(400).send("Updating subCategory failed");
  }
};

exports.remove = async (req, res) => {
  try {
    // if (!req.params.slug) {
    //   throw new Error();
    // }
    const deleted = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    }).exec();
    if (!deleted) {
      throw new Error();
    }
    res.json("SubCategory " + req.params.slug + " has been deleted");
  } catch (err) {
    res.status(400).send("Deleting subCategory failed");
  }
};
