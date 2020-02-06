module.exports = {
    name: "prefix",
    alias: ["setprefix"],
    args: true,
    description: "Sets the prefix for the bot in your server",
    usage: "<string>",
    cooldown: 3000,
    perms: ["MANAGE_GUILD"],
    execute(message, args, bot) {
        var guildName = message.member.guild.id;
        bot.myGuilds[guildName].prefix = args[0];
        message.channel.send(`Set server prefix to ${args[0]}`);
    }
};
