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
            .then((m) => m.delete({ timeout: 2000 }));
        bot.updateJSON("../guilds.json", bot.myGuilds);
    },
    load: load,
};

function load() {
    //look for message deletions
    client.addEventListener("messageDelete", (message) => {
        if (message.member) {
            time = Date.now();
            embed = findEmbeds(message);
            embed.setTitle(`Message Deleted In ${message.channel.name}`);
            embed.setColor(message.member.displayColor);
            embed.setAuthor(
                message.member.displayName,
                message.member.user.avatarURL()
            );
            embed.setDescription(message.content);
            embed.setTimestamp(time);
            sendToLog(embed, message.member);
        } else {
            time = Date.now();
            embed = findEmbeds(message);
            embed.setTitle(`Message Deleted In ${message.channel.name}`);
            embed.setColor("f60011");
            embed.setDescription(message.content);
            embed.setTimestamp(time);
            sendToLog(embed, message.member);
        }
    });

    //log message edits
    client.addEventListener("messageUpdate", (oldM, newM) => {
        if (oldM.content === newM.content) return;
        time = Date.now();
        embed = new Discord.MessageEmbed();
        embed.setTitle(`Message Edited In ${oldM.channel.name}`);
        embed.addField("From", oldM.content);
        embed.addField("To", newM.content);
        embed.setColor(newM.member.displayColor);
        embed.setTimestamp(time);
        embed.setAuthor(oldM.member.displayName, oldM.author.avatarURL);
        embed.setFooter(oldM.id);
        embed.setURL(newM.url);
        sendToLog(embed, newM.member);
    });

    //log bans

    client.addEventListener("guildBanAdd", (guild, user) => {
        time = Date.now();
        embed = new Discord.MessageEmbed();
        embed.setTitle(`${user.tag} Banned`);
        embed.setColor("FF0000");
        embed.setTimestamp(time);
        embed.setThumbnail(user.avatarURL());
        guild.fetchBan(user).then((info) => {
            embed.setDescription(`${info.reason}`);
            sendToLog(embed, user);
        });
    });

    //log user joins
    client.addEventListener("guildMemberAdd", (member) => {
        time = Date.now();
        embed = new Discord.MessageEmbed();
        embed.setTitle(`${member.displayName} Joined!`);
        embed.setColor("00FF00");
        embed.setDescription(member.id);
        embed.setTimestamp(time);
        embed.setThumbnail(member.user.avatarURL);
        embed.setFooter("Welcome to the server!");
        sendToLog(embed, member);
    });

    //send the welcome message
    client.addEventListener("guildMemberAdd", (member) => {
        const guildName = member.guild.id;
        const channelName = client.myGuilds[guildName].welcomeChannel;
        const welcomeMsg = client.myGuilds[guildName].welcomeMessage;
        var channel;

        try {
            client.logger.debug(
                `guildMemberAdd: cn ${channelName} wm ${welcomeMsg}`
            );
            channel = member.guild.channels.resolve(channelName);
        } catch (err) {
            client.logger.error(`Couldn't get channel ${channelName}`);
            client.logger.error(err);
        }

        const result = welcomeMsg.interpolate({ user: member.user });

        if (channel) {
            channel.send(result);
        } else {
            chanID = client.myGuilds[member.guild.id].logChannel;
            channel = member.guild.channels.resolve(chanID);
            if (channel) {
                channel.send(
                    `Tried to send welcome message, but the channel was ${channel}`
                );
            } else {
                client.logger.error("Moderation not setup for this server");
            }
        }
    });

    //log user leaves
    client.addEventListener("guildMemberRemove", (member) => {
        time = Date.now();
        embed = new Discord.MessageEmbed();
        embed.setTitle(`${member.displayName} Left!`);
        embed.setColor("FF1010");
        embed.setDescription(member.id);
        embed.setTimestamp(time);
        embed.setThumbnail(member.user.avatarURL());
        embed.setFooter("See ya later!");
        sendToLog(embed, member);
    });
}

//TODO

function sendToLog(embed, member) {
    chanID = client.myGuilds[member.guild.id].logChannel;
    channel = member.guild.channels.resolve(chanID);
    if (channel) {
        channel.send(embed);
    } else {
        client.logger.error("Moderation not setup for this server");
    }
}

function findEmbeds(message) {
    let result = new Discord.MessageEmbed();
    var e = message.embeds[0];
    if (e) {
        client.logger.debug(`Found an embed ${e}`);
        // if (e.title) result.setTitle(e.title);

        if (e.thumbnail) result.setThumbnail(e.thumbnail.url);

        if (e.description) result.setDescription(e.description);

        if (e.footer) result.setFooter(e.footer.text);

        if (e.author) result.setAuthor(e.author.name, e.author.icon);

        if (e.color) result.setColor(e.color);

        if (e.image) result.setImage(e.image.url);

        if (e.file) result.attachFile(e.file);

        if (e.files) result.attachFiles(e.files);

        if (e.url) result.setURL(e.url);
    }

    var att = message.attachments.first();
    if (att) {
        client.logger.debug(`Found an attachment ${att}`);
        result.setImage(att.url);
    }

    return result;
}
