// this is kinda useles since we wanted to make a privat bot creator
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Botschema = new Schema({
  bot_id: {
    type: Number,
    required: true
  },
  owner_id: {
    type: Number,
    required: true
  },
  expires: {
    type: String,
    required: true
  }
}, {timestamps: true});

const Bots = mongoose.model("bots", Botschema);
module.exports = Bots;
