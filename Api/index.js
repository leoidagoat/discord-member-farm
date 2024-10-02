// this code was written by leoidagoat and dev.dieg0 on discord.

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");


const apiRouter = require("./routes/api");
const botRouter = require("./routes/bots");
const authRouter = require("./routes/auth");

//your mongodb string
const db = ""
const app = express();
const server = http.createServer(app);

mongoose.connect(db)
   .then((result) => {
    console.log("mongoose success")
    server.listen(4333, () => {
        console.log("our http server is up!")
    })
   })
   .catch((err) => {
    console.log("mongoose failed")
   })

app.get("/", (req, res) => {
    res.status(200).json({"success": true, "message": "members api up and running!"})
})

app.use("/api", apiRouter)
app.use("/bot", botRouter)
app.use("/auth", authRouter)

app.use((req, res, next) => {
    res.status(404).json({"success": false, "error": "unknown path"})
})
