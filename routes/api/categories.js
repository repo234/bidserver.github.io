var express = require("express");
var router = express.Router();
var { Category, validateCategory } = require("../../models/catrgory");
var { auth } = require("../../middelware/auth");
var { isadmin } = require("../../middelware/isadmin");

//create category
router.post("/create", auth, isadmin, async (req, res) => {
  console.log(req.user);
  let category = await Category.findOne({ name: req.body.name });
  if (category) return res.status(400).send("Category already exist");
  let { error } = validateCategory(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    category = new Category();
    category.name = req.body.name;
    category.adminId = req.user._id;
    category.adminName = req.user.name;
    await category.save();
    return res.send(category);
  }
});

//get all categories
router.get("/", async (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    if (categories) {
      res.json(categories);
    }
    if (!categories) {
      res.json("no category found");
    }
  });
});
// get category by id
router.get("/:id", async (req, res) => {
  let category = await Category.findById(req.params.id);
  if (category) {
    return res.json(category);
  }
  if (!category) {
    return res.json("no category found");
  }
});

router.put("/:id", async (req, res) => {
  let category = await Category.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      createdAt: Date.now(),
    }
  );
  res.send("created");
});
module.exports = router;
