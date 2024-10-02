# this is only ment to be a "exmaple" because its so simple.
import discord, requests
import asyncio
from discord.ext import commands, tasks
from discord.ui import Button, View 

client = commands.Bot(command_prefix='!', intents=discord.Intents.all())

settings = {
    "token": "slayagain",
    "stock_channel": "yourhoost/auth/verify"
    }

# change this to yours
verify_url = "https://discord.com/oauth2/authorize?client_id=1277289004882067527&response_type=code&redirect_uri=http%3A%2F%2F192.168.2.145%3A4333%2Fauth%2Fcallback&scope=guilds.join+guilds+identifyy"


@client.command()
async def verify(ctx):
    button = Button(label='Verify', url=verify_url)
    view = View()
    view.add_item(button)
    await ctx.send(view=view)

client.run(settings['token'])
