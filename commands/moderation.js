const client = require("../bot.js");
const Discord = require("discord.js");

module.exports = {
    name: "moderation",
    alias: ["mod", "m"],
    args: true,
    description: "Manage the bot's moderation functions",
    usage: "<setup>",
    category: "Moderation",
    execute(message, args, bot) {
        bot.myGuilds[message.member.guild.id].logChannel = message.channel.id;
        message.channel
            .send("Set up logging in this channel")
            .then(m => m.delete(2000));
        bot.updateJSON("../guilds.json", bot.myGuilds);
    }
};

//look for message deletions
client.events.messageDelete = message => {
    time = Date.now();
    embed = new Discord.RichEmbed();
    embed.setTitle(`Message Deleted In ${message.channel.name}`);
    embed.setColor(message.member.displayColor);
    embed.setAuthor(message.member.displayName, message.member.user.avatarURL);
    embed.setDescription(message.content);
    embed.setTimestamp(time);

    chanID = client.myGuilds[message.member.guild.id].logChannel;
    channel = message.member.guild.channels.get(chanID);
    if (channel) {
        channel.send(embed);
    } else {
        client.logger.error("Moderation not setup for this server");
    }
};

//log message edits
client.events.messageUpdate = (oldM, newM) => {
    if (oldM.content === newM.content) return;
    time = Date.now();
    embed = new Discord.RichEmbed();
    embed.setTitle(`Message Edited In ${oldM.channel.name}`);
    embed.addField("From", oldM.content);
    embed.addField("To", newM.content);
    embed.setColor(newM.member.displayColor);
    embed.setTimestamp(time);
    embed.setAuthor(oldM.member.displayName, oldM.author.avatarURL);
    embed.setFooter(oldM.id);
    chanID = client.myGuilds[newM.member.guild.id].logChannel;
    channel = newM.member.guild.channels.get(chanID);
    if (channel) {
        channel.send(embed);
    } else {
        client.logger.error("Moderation not setup for this server");
    }
};

//log bans
client.events.guildBanAdd = (guild, user) => {
    time = Date.now();
    embed = new Discord.RichEmbed();
    embed.setTitle(`${user.tag} Banned`);
    embed.setColor("FF0000");
    embed.setTimestamp(time);
    embed.setThumbnail(user.avatarURL);
    guild.fetchBan(user).then(info => {
        embed.setDescription(`${info.reason}`);
        chanID = client.myGuilds[guild.id].logChannel;
        channel = guild.channels.get(chanID);
        if (channel) {
            channel.send(embed);
        } else {
            client.logger.error("Moderation not setup for this server");
        }
    });
};

//log users leaving and joining
//TODO
