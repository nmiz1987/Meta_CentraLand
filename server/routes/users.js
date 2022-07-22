const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", findUserById, (req, res) => {
  res.json(res.user);
});

router.get("/:userName/:password", getUserAndPassword, (req, res) => {
  res.json(res.user);
});

//create new user
router.post("/", findIfUserInDB, async (req, res) => {
  var amount = 0;
  try {
    if (req.body.role === "Buyer") {
      amount = 1000;
    }

    //create hash password based on salt and password and store only the hash!
    const salt = await bcrypt.genSalt(10);
    var hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      fullName: req.body.fullName,
      userName: req.body.userName,
      password: hashPassword,
      role: req.body.role,
      money: amount,
    });
    const newUser = await user.save();
    console.log("New User Created", newUser);
    res.status(201).send({
      id: newUser._id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      role: newUser.role,
      money: newUser.money,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//for purchase land
router.put(
  "/buyLand/:buyer/:seller/:price",
  getBuyerAndSeller,
  async (req, res) => {
    res.seller.money += Number(req.params.price);
    await res.seller.save();
    res.buyer.money -= Number(req.params.price);
    const updateBuyer = await res.buyer.save();
    res.json(updateBuyer);
  }
);

router.delete("/:id", getUserAndPassword, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUserAndPassword(req, res, next) {
  let user;
  try {
    user = await User.findOne({ userName: req.params.userName });
    const isValid = await bcrypt.compare(req.params.password, user.password);
    if (!isValid) {
      return res.status(404).json({ message: "Cannot find User" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = {
    id: user._id,
    fullName: user.fullName,
    userName: user.userName,
    role: user.role,
    money: user.money,
  };
  next();
}

async function getBuyerAndSeller(req, res, next) {
  let buyer;
  let seller;
  try {
    buyer = await User.findById(req.params.buyer);
    seller = await User.findById(req.params.seller);
    if (buyer == null) {
      return res.status(404).json({ message: `Cannot find User ${buyer}` });
    }
    if (seller == null) {
      return res.status(404).json({ message: `Cannot find User ${seller}` });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.buyer = buyer;
  res.seller = seller;
  next();
}

async function findIfUserInDB(req, res, next) {
  let user;
  try {
    user = await User.find({ userName: req.body.userName });
    if (user.length) {
      return res.status(409).json({ message: "User is already in the system" }); //409 = Conflict
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

async function findUserById(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = {
    id: user._id,
    fullName: user.fullName,
    userName: user.userName,
    role: user.role,
    money: user.money,
  };
  next();
}

module.exports = router;
