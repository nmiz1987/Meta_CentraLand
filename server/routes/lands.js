const express = require("express");
const router = express.Router();
const Land = require("../models/land");
// const sha256 = require("sha256");
const landsDB = require("../landsDB.json");

// Get all users
router.get("/", async (req, res) => {
  try {
    const lands = await Land.find();
    res.json(lands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get one land
router.get("/:id", getLand, (req, res) => {
  res.json(res.land);
});

//create all lands for ADMIN only!
router.post("/createAllLand/:owner", async (req, res) => {
  console.log("req.body.fullName", req.body.fullName);
  try {
    if (req.body.fullName !== "admin")
      res.status(400).send("Only admin can create the land");
    for (let i = 0; i < landsDB.length; i++) {
      const land = new Land({
        owner: "Netanel.Ltd",
        type: landsDB[i].type,
        price: landsDB[i].type === "Real Estate" ? randPrice() : "999999999",
        ownerID: req.params.owner,
        game:
          landsDB[i].type === "Real Estate"
            ? "https://numble-clone.vercel.app/"
            : "",
        forSale: landsDB[i].forSale,
      });
      await land.save();
    }
    console.log(`${landsDB.length} lands created`);
    res.status(201).json({ message: `${landsDB.length} lands created` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/updateLand/:id", getLand, async (req, res) => {
  res.land.forSale = req.body.forSale;
  res.land.price = req.body.price;
  res.land.game = req.body.game;
  try {
    const updateLand = await res.land.save();
    res.json(updateLand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//update land info due to purchase
router.put("/buyLand/:id", getLand, async (req, res) => {
  res.land.owner = req.body.owner;
  res.land.ownerID = req.body.ownerID;
  res.land.forSale = "false"; // prevent someone to buy the land until the owner will decide
  try {
    const updateLand = await res.land.save();
    res.json(updateLand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", getLand, async (req, res) => {
  try {
    await res.land.remove();
    res.json({ message: "Deleted Land" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Deleting all DB - will be access only from external application for security!!
router.delete("/", async (req, res) => {
  console.log("deleting all DB...");
  try {
    await Land.deleteMany({});
    res.json({ message: "All the DB deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getLand(req, res, next) {
  let land;
  try {
    land = await Land.findById(req.params.id);
    if (land == null) {
      return res.status(404).json({ message: "Cannot find land" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.land = land;
  next();
}

function randPrice() {
  let max = 200;
  let min = 15;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = router;
