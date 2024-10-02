
const express = require("express")
const router = express.Router()
const UserSchemas = require("../models/user")
const axios = require("axios")

router.get("/stocks", (req, res) => {
  UserSchemas.countDocuments({})
    .then((count) => {
      res.status(200).json({ "success": true, "count": count })
    })
    .catch((err) => {
      res.status(400).json({ "success": false, "count": 0, "errorMessage": err })
    })
})

router.get("/insert_user/:userid/:access_token", (req, res) => {
  const newSchema = new UserSchemas({
    userid: req.params.userid,
    access_token: req.params.access_token
  })

  newSchema.save()
    .then((result) => {
      res.json({ "success": true, message: "User got added to the database.", "result": result })
    })
    .catch((error) => {
      res.json({ "success": false, "message": "Failed to create user", "error": error })
    })
})

router.get("/testuser", (req, res) => {
  const newSchema = new UserSchemas({
    userid: 0,
    access_token: "HASHED_TOKEN"
  })
  newSchema.save()
    .then((result) => {
      res.json({ "success": true, "message": "test user created!", "result": result })
    })
    .catch((error) => {
      res.json({ "success": false, "message": "failed to create the test user", "error": error })
    })
})

router.get("/join/:count/:guildid", (req, res) => {
  const count = parseInt(req.params.count, 10)
  if (!isNaN(count) && count > 0) {
    const errors = []
    const successes = []

    for (let i = 0; i < count; i++) {
      UserSchemas.aggregate([{ $sample: { size: 1 } }])
        .then((randomUser) => {
          if (randomUser.length > 0) {
            const selectedUser = randomUser[0].userid
            axios.get(`https://discord.com/api/v10/guilds/${req.params.guildid}/members/${selectedUser}`, {
              headers: {
                'Authorization': 'Bot ' + token,
                'Content-Type': 'application/json'
              }
            })
              .then((result) => {
                successes.push({ "message": `API call successful for user: ${selectedUser}` })
              })
              .catch((error) => {
                errors.push({ "message": `Failed for user: ${selectedUser}`, "error": error })
              })
          } else {
            errors.push({ "message": "No users found!" })
          }
        })
        .catch((error) => {
          errors.push({ "message": "Error fetching random user!", "error": error })
        })
    }

    res.status(200).json({
      "success": true,
      "message": `${count} API calls`,
      "results": { successes, errors }
    })
  } else {
    res.status(400).json({ "success": false, "message": "Invalid count provided!" })
  }
})

module.exports = router
