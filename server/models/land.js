const mongoose = require("mongoose");

const landSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  ownerID: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  game: {
    type: String,
    default: "",
  },
  forSale: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model("land", landSchema);
