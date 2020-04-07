const client = require("../bot.js");
const Discord = require("discord.js");
const starFile = "./starboard.json";

emoji = {
    name: "emoji",
    args: true,
    description: "Change the emoji used for starboard detection",
    execute(message, args, bot) {
        let e_raw = args.shift(); //have to do some processing to get the ID
        let e_id = e_raw.startsWith("<")
            ? e_raw.slice(e_raw.lastIndexOf(":") + 1, e_raw.indexOf(">"))
            : e_raw;
        client.logger.debug(`Emoji: ${e_raw}`);
        var emoji = message.guild.emojis.resolve(e_id); //it would be cool if the emoji manager could resolve an emoji as it appears in the message
        bot.myGuilds[message.guild.id].star_emoji = emoji ? emoji.name : e_id; //emoji manager also can't resolve unicode emoji
        bot.logger.info(
            `Set starboard emoji for ${message.guild.name} to ${e_id}`
        );
        message.channel.send(`Set starboard emoji to ${e_raw}`);
    },
};

channel = {
    name: "channel",
    args: true,
    description: "Change the channel starboard messages are sent to",
    execute(message, args, bot) {
        var chan = args.shift();
        if (chan) {
            bot.myGuilds[message.guild.id].starboard_chan = chan.id;
            bot.logger.info(
                `Set starboard channel for ${message.guild.name} to ${chan.id}`
            );
            message.channel.send(`Starboard channel set to ${chan}`);
        } else {
            bot.myGuilds[message.guild.id].starboard_chan = message.channel.id;
            bot.logger.info(
                `Set starborad channel for ${message.guild.name} to ${message.channel.name}`
            );
            message.channel.send(`Starboard channel set to ${message.channel}`);
        }
    },
};

threshold = {
    name: "threshold",
    args: true,
    description:
        "Sets the number of reactions needed to make it to the starboard",
    execute(message, args, bot) {
        var count = args.shift();
        bot.myGuilds[message.guild.id].star_lvl = count;
        bot.logger.info(
            `Set starboard threshold in ${message.guild.name} to ${count}`
        );
        message.channel.send(`Starboard now requires ${count} reactions`);
    },
};

ignore = {
    name: "ignore",
    args: true,
    description: "Make the bot ignore a channel for starboard reactions",
    execute(message, args, bot) {
        var chan = args.shift();

        if (chan) {
            if (bot.myGuilds[message.guild.id].ignore.includes(chan)) {
                var i = bot.myGuilds[message.guild.id].ignore.indexOf(chan.id);
                delete bot.myGuilds[message.guild.id].ignore[i];
                bot.logger.info(`Enabled starboard for ${chan}`);
                message.channel.send(`Enabled starboard in ${chan}`);
            } else {
                bot.myGuilds[message.guild.id].ignore.push(chan);
                bot.logger.info(
                    `Starboard disabled for ${message.guild.name} channel ${message.channel}`
                );
                message.channel.send(`Starboard disabled in ${chan}`);
            }
        } else {
            if (
                bot.myGuilds[message.guild.id].ignore.includes(
                    message.channel.id
                )
            ) {
                var i = bot.myGuilds[message.guild.id].ignore.indexOf(
                    message.channel.id
                );
                delete bot.myGuilds[message.guild.id].ignore[i];
                bot.logger.info(`Enabled starboard for ${message.channel}`);
                message.channel.send(`Enabled starboard in ${message.channel}`);
            } else {
                bot.myGuilds[message.guild.id].ignore.push(message.channel.id);
                bot.logger.info(
                    `Starboard disabled for ${message.guild.name} channel ${message.channel}`
                );
                message.channel.send(
                    `Starboard disabled in ${message.channel}`
                );
            }
        }
    },
};

module.exports = {
    name: "starboard",
    alias: [],
    description: "Starboard manager. See documentation for detailed info",
    perms: ["MANAGE_GUILD"],
    subcommands: {
        emoji: emoji,
        channel: channel,
        ignore: ignore,
        threshold: threshold,
    },
    args: true,
    usage: "<emoji|channel|ignore|threshold> <param>",
    category: "Management",
    detailed:
        "**Emoji:** sets the emoji the bot will listen for to send messages to the starboard ***!the bot must have access to the emoji to be able to listen for it!*** (eg: !starboard emoji :heart:)\n" +
        "**Channel:** set what channel the bot will use as the starboard. If no channel is provided, the channel the command was send in will be used instead (eg: !starboard channel #starboard)\n" +
        "**Ignore:** if you don't want the bot to listen in a certain channel, call this command there or provide it as an argument (eg: !starboard ignore #secret-admin-channel)\n" +
        "**Threshold:** sets the number of emoji reactions a message needs to get to be sent to the starboard channel",
    execute(message, args, bot) {
        let prefix = bot.myGuilds[message.member.guild.id].prefix;
        message.reply(`Do ${prefix}help starboard for help with this command`);
    },
    load() {
        client.addEventListener("messageReactionAdd", (reaction, user) => {
            client.logger.debug(
                `Reaction detected on ${reaction.message.guild.name}`
            );

            var server = reaction.message.guild;
            if (!client.myGuilds[server.id].starboard_chan) {
                client.logger.warn(
                    `Starboard is not set up for ${server.name}`
                );
                return;
            }

            var guildData = client.myGuilds[server.id];
            if (guildData.ignore.includes(reaction.message.channel.id)) {
                client.logger.info("Channel ignored for starboard");
                return;
            }

            if (
                reaction.count >= guildData.star_lvl &&
                reaction.emoji.name == guildData.star_emoji
            ) {
                //do starboard stuff
                var channel = server.channels.resolve(guildData.starboard_chan);
                client.logger.debug(`Channel ${channel}`);
                var author = reaction.message.member;
                client.logger.debug(`Author ${author}`);
                var text = reaction.message.content;
                client.logger.debug(`text ${text}`);
                var embeds = reaction.message.embeds;
                client.logger.debug(`embeds ${embeds}`);
                var time = reaction.message.createdTimestamp;
                client.logger.debug(`time ${time}`);

                var result = new Discord.MessageEmbed();

                result.setTimestamp(time);
                result.setColor(author.displayColor);
                result.setAuthor(author.displayName, author.user.avatarURL);
                result.setFooter(server.name);
                result.setDescription(text);
                result.setURL(reaction.message.url);

                var e = reaction.message.embeds[0];
                if (e) {
                    client.logger.debug(`Found an embed ${e}`);
                    if (e.title) result.setTitle(e.title);

                    if (e.thumbnail) result.setThumbnail(e.thumbnail.url);

                    if (e.description)
                        result.setDescription(text + "\n\n" + e.description);

                    if (e.footer) result.setFooter(e.footer.text);

                    if (e.author)
                        result.setAuthor(e.author.name, e.author.icon);

                    if (e.color) result.setColor(e.color);

                    if (e.image) result.setImage(e.image.url);

                    if (e.file) result.attachFile(e.file);

                    if (e.files) result.attachFiles(e.files);

                    if (e.url) result.setURL(e.url);
                }

                var att = reaction.message.attachments.first();
                if (att) {
                    client.logger.debug(`Found an attachment ${att}`);
                    result.setImage(att.url);
                }

                if (client.starredMsgs[reaction.message.id]) {
                    client.logger.info(
                        `Message was starred already: ${reaction.message.url}`
                    );
                    var id = client.starredMsgs[reaction.message.id].star_id;
                    channel.messages
                        .find((msg) => msg.id === id)
                        .edit(`${reaction.emoji} #${reaction.count}`, result);
                    return;
                } else {
                    channel
                        .send(`${reaction.emoji} #${reaction.count}`, result)
                        .then((msg) => {
                            client.starredMsgs[reaction.message.id] = {
                                star_id: msg.id,
                            };
                        });
                }
            }

            //    client.commands.get('reactrole').handle(reaction, user);

            client.updateJSON(starFile, client.starredMsgs);
        });
    },
};
