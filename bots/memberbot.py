# please do not sell this to anyone its free for everyone.
# i wont really explain how to setup this, if you need any help hit me up on discord leoidagoat


import discord
from discord.ext import commands, tasks
import asyncio
from discord.ui import Button, View 
import requests

client = commands.Bot(command_prefix='!', intents=discord.Intents.all())

settings = {
    "token": "slay",
    "stock_channel": 1,
    "cmd_channel": 1,
    "api": "yourhost/"
    }
verifytoken = 'slay'
@client.event
async def on_ready():
    res = requests.get(f"{settings['api']}/bot/pingbot/{client.user.id}")
    if res.status_code != 200:
        print("invaild lincense")
        try:
            await client.close()
        finally:
            print("logged out")
    else:
        print("----------------------")
        print("Welcome, im now ready!")
        print("this source code was written, belongs to the big team.")
        print("----------------------")
        stock_loop.start()
        licenseloop.start()
 
@tasks.loop(seconds=90)
async def stock_loop():
    req = requests.get(f"{settings['api']}/api/stocks")
    data = req.json()
    count = data["count"]
    chan = client.get_channel(settings['stock_channel'])
    embed = discord.Embed(description=f'**Stock:** {count}')
    msg = await chan.send(embed=embed)
    await asyncio.sleep(60)
    await msg.delete()

@tasks.loop(seconds=40)
async def licenseloop():
    res = requests.get(f"{settings['api']}/bot/pingbot/{client.user.id}")
    if res.status_code != 200:
        print("invaild license")
        try:
            await client.close()
        finally:
            print("logged out")
    else:
        print("vaild license! YAYYY!!! ")

@client.command()
async def add(ctx):
    button = Button(label='Add Bot', url='https://discord.com/oauth2/authorize?client_id=yourclientid&permissions=0&integration_type=0&scope=bot+applications.commands')
    view = View()
    view.add_item(button)
    await ctx.send(view=view)

@client.command()
async def stock(ctx):
    res = requests.get(f"{settings['api']}/api/stocks")
    data = res.json()
    stock = data["count"]
    button = Button(label='Wait for restock!', disabled=True)
    view = View()
    view.add_item(button)
    if stock != 0:
        embed = discord.Embed(description=f'**Stock:** {stock}')
        await ctx.send(embed=embed)
    else:
        embed = discord.Embed(description=f'**Stock:** {stock}')
        await ctx.send(embed=embed, view=view)
        return
    
@client.command()
async def join(ctx, server_id, amount=None):
    async def support(interaction):
        await interaction.response.send_message("<#1288861813860991057>", ephemeral=True)
    if ctx.channel.id != settings["cmd_channel"]:
        await ctx.message.delete()
        return
    try:
        loadingembed = discord.Embed(description="Hold on, we are getting things ready for you!")
        msg = await ctx.channel.send(embed=loadingembed)
        req = requests.get(f"{settings['api']}/api/stocks")
        data = req.json()
        stock = int(data["count"])
        if stock == 0:
            stockembed = discord.Embed(description="Sorry, there is no stock left!")
            await msg.edit(embed=stockembed)
            return
        
        max_amount = 3
        bronze = discord.utils.get(ctx.guild.roles, name='Bronze') # leo sir this is messy - ikr but ill prefer to do it like this
        if bronze in ctx.author.roles:
            max_amount = 15
        silver = discord.utils.get(ctx.guild.roles, name='Silver')
        if silver in ctx.author.roles:
            max_amount = 20
        gold = discord.utils.get(ctx.guild.roles, name='Gold')
        if gold in ctx.author.roles:
            max_amount = 25
        premium = discord.utils.get(ctx.guild.roles, name='Premium')
        if premium in ctx.author.roles:
            max_amount = 50
        diamond = discord.utils.get(ctx.guild.roles, name='Diamond+')
        if diamond in ctx.author.roles:
            max_amount = 100
        if amount is None:
            amount = max_amount
        elif amount > max_amount:
            amount = max_amount
        if amount <= amount:

        
            res = requests.get(f"{settings['api']}/api/join/{amount}/{server_id}")
            print(res.json(), res.status_code, res.text)
            if res.status_code == 401:
                stockembed = discord.Embed(title="Bot is not in your server!", description="please add the bot to your server!")
                button = Button(label='Add Bot', url='https://discord.com/oauth2/authorize?client_id=1277289004882067527&permissions=0&integration_type=0&scope=bot+applications.commands')
                view = View()
                view.add_item(button)
                await msg.edit(embed=stockembed, view=view)
                return
        elif res.status_code == 400:
            errorembed400 = discord.Embed(description="Hey, There was an Error (Code: 400)",)
            await ctx.edit(embed=errorembed400)
            print(res.json(), res.text)
            return
        headers = {
                    'user-agent': 'BDP (http://example.com), v0.0.1)',
                    'authorization': 'Bot ' + verifytoken,
                    }
        r = requests.get(f'https://discord.com/api/v9/guilds/{server_id}', headers=headers)
        data = r.json()
        name = data['name']
        adding = discord.Embed(description=f"Adding **{amount}** members to `{name}`")
        await msg.edit(embed=adding)

    except Exception as error:
            errorembed = discord.Embed(description="Sorry, there was a unknow error while getting things ready for you.")
            view = View()
            button = Button(label="Create a ticket")
            view.add_item(button)
            button.callback = support
            await msg.edit(embed=errorembed, view=view)
            print(error)

client.run(settings['token'])
