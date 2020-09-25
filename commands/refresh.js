const { MessageFlags } = require("discord.js");
module.exports = {
    name: "refresh",
    alias: ["ref", "reset"],
    perms: ["ADMINISTRATOR"],
    args: false,
    usage: "",
    description:
        "Refreshes a guild's data for the bot, which may help fix some bugs",
    category: "Management",
    execute(message, args, bot) {
        let guildID = message.guild.id;

        bot.database.removeGuild(guildID, bot.logger);
        bot.database.addGuild(message.guild, bot.logger);

        bot.myGuilds[guildID] = {
            name: message.guild.name,
            prefix: "!",
            welcomeChannel: "general",
            welcomeMessage: "Welcome to the server, <@${user.id}>",
            ignore: [],
        };
        bot.updateJSON(bot.guildFile, bot.myGuilds);
        message.channel.send(
            'Reset everything to default. The prefix is now "!"'
        );
    },
};
