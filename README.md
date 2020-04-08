# Just Monika

Just Monika

A vaguely Monika Themed bot created by `Emerald#6666` on discord. You can join [this](https://discord.gg/Jm7GFAT) server if you need to talk to me.

There's some documentation in the wiki, though it's incomplete cause I'm both busy and lazy. You can add the bot to your server with [this](https://discordapp.com/oauth2/authorize?&client_id=543307204644700170&scope=bot&permissions=134537286) link. She'll be able to tell you more detailed information about the commands.

Feel free to open an issue if there's something buggy or to request a feature.

# Getting Started

First you'll need to get [node.js](https://nodejs.org/en/download/) if you want to run this code on your own machine. Running init.sh will make all of the necessary json files, though you'll still need to format `config.json` yourself.

```json
{
    "token": "yourDiscordappToken",
    "debug": true,
    "winston_lvl": "debug"
}
```

As long as you have a config.json with the token, the bot should at least start for you.

To enable the goodreads commands, you'll need some `goodreads_key` and `goodreads_secret` fields too.

There are some other comands, like gitpull, that will need to be tweaked to work for you.

Once you've got all of the JSON squared away, simply do `npm start` in the root directory and the bot should start right up. If you use StartBot.sh the bot will automatically start itself if it crashes or something.
