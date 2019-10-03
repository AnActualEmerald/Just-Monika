# Just Monika
 Just Monika


A vaguely Monika Themed bot created by `Emerald#6666` on discord. You can join [this](https://discord.gg/Jm7GFAT) server if you need to talk to me. 

There's some documentation in the wiki, though it's incomplete cause I'm both busy and lazy. You can add the bot to your server with [this](https://discordapp.com/oauth2/authorize?&client_id=543307204644700170&scope=bot&permissions=134537286) link. She'll be able to tell you more detailed information about the commands.

Feel free to open an issue if there's something buggy or to request a feature.

# Getting Started

First you'll need to get [node.js](https://nodejs.org/en/download/) if you want to run this code on your own machine. For security reasons I haven't included any of my JSON files in the repository, so you'll have to recreate those to get the bot to run. Most of them just need to exist, so it's okay if they're just ```{}```

The most important file you'll need is a config.json in the root directory that looks like 

```json
{
"token":"yourDiscordappToken",
"prefix":"whateverYouWant",
"debug":true,
"winston_lvl":"debug"
}
```

As long as you have a config.json with the token, the bot should at least start for you.

Once you've got all of the JSON squared away, simply do `node ./bot.js` in the root directory and the bot should start right up. 
