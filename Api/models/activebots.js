// this is kinda useles since we wanted to make a private bot creator

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActiveBotSchema = new Schema({
  last_ping: {
    type: Date,
    required: true
  },
  bot_id: {
    type: Number,
    required: true
  }
});

const ActiveBots = mongoose.model("activebots", ActiveBotSchema);

module.exports = ActiveBots;
