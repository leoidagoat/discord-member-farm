//  kinda useles it was for the private bot maker that we were making
const express = require("express");
const router = express.Router();
const Bots = require("../models/bots");
const activeBots = require("../models/activebots");

router.get("/createbot/:bot_id/:owner_id/:expires", async (req, res) => {
  const bot_id = parseInt(req.params.bot_id);
  const owner_id = parseInt(req.params.owner_id);
  const newBot = new Bots({
    bot_id: bot_id,
    owner_id: owner_id,
    expires: req.params.expires,
  });

  newBot.save()
    .then((result) => {
      res.status(200).json({ success: true, registered: true, result });
    })
    .catch((err) => res.status(400).json({ success: false, registered: false, error: err }));
});

router.get("/bots", async (req, res) => {
  try {
    const totalBots = await Bots.countDocuments({});
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const activeBotsCount = await activeBots.countDocuments({ last_ping: { $gte: twoMinutesAgo } });

    res.json({ success: true, totalBots, activeBots: activeBotsCount });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});



router.get("/pingbot/:bot_id", async (req, res) => {
  try {
    if (req.params.bot_id) {
      const bot = await Bots.findOne({ bot_id: req.params.bot_id });

      if (bot) {
        const onlineBot = await activeBots.findOne({ bot_id: req.params.bot_id });

        if (onlineBot) {
          const updated = await activeBots.findOneAndUpdate(
            { bot_id: req.params.bot_id },
            { last_ping: new Date() },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Bot ping updated", result: updated });
        } else {
          const newOnlineBot = new activeBots({
            last_ping: new Date(),
            bot_id: req.params.bot_id,
          });
          await newOnlineBot.save();
          res.status(200).json({ success: true, message: "Bot pinged", result: newOnlineBot });
        }
      } else {
        res.status(400).json({ success: false, error: "Bot does not exist" });
      }
    } else {
      res.status(400).json({ success: false, error: "Bot ID is required" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;
