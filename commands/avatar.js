var Discord = require("discord.js");

module.exports = {
    name: "avatar",
    alias: "pfp",
    args: true,
    usage: "<user>",
    description: "Returns a user's profile picture",
    category: "Utilities",
    execute(message, args, bot) {
        var user = message.mentions.users.first();
        var url = user.avatarURL;
        var embed = new Discord.MessageEmbed()
            .setTitle(user.username + "'s avatar")
            .setImage(url);

        message.channel.send(embed);
    }
};
