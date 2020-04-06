const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "help",
    description: "show all commands and their variables",
    args: false,
    alias: "",
    category: "Utilities",
    execute(message, args, bot) {
        let data = [];
        let guild = message.member.guild.id;
        if (!args.length || message.mentions.channels.size > 0) {
            var count = 0;
            var embeds = new Map();

            bot.commands.forEach((value, key) => {
                if (!value.category) {
                    value.category = "other";
                }

                if (embeds.has(value.category)) {
                    embeds.get(value.category).addField(key, value.description);
                } else {
                    let tmp = new MessageEmbed()
                        .setTitle(value.category)
                        .addField(key, value.description)
                        .setThumbnail(bot.user.avatarURL);
                    embeds.set(value.category, tmp);
                }
            });
            embeds.forEach((value, key) => {
                data.push(value.setColor(message.member.displayColor));
            });
            data[data.length - 1].setFooter(
                `You can send \`${bot.myGuilds[guild].prefix}help [command name]\` to get info on a specific command!`
            );

            return data.forEach(val => {
                if (
                    message.mentions.channels.size > 0 &&
                    message.member.hasPermission("MANAGE_CHANNELS") //don't want plebs abusing this
                ) {
                    message.mentions.channels.first().send(val);
                } else {
                    message.author.send(val).catch(error => {
                        bot.logger.error(
                            `Could not send help DM to ${message.author.tag}.\n`,
                            error
                        );
                        message.reply(
                            "it seems like I can't DM you! Do you have DMs disabled?"
                        );
                    });
                }
            });
        } else {
            const com = bot.commands.get(args[0]);
            let usage = com.usage ? com.usage : "";
            let alias = com.alias ? com.alias : "none";
            let details = com.detailed ? com.detailed : com.description;
            data.push(`**Info about ${com.name}**`);
            data.push(
                `Usage: ${bot.myGuilds[guild].prefix}${com.name} ${usage}`
            );
            data.push(`Aliases: ${alias}`);

            if (com.cooldown) data.push(`Cool-down: ${com.cooldown / 1000}s`);

            data.push(`${details}`);

            return message.author
                .send(data, { split: true })
                .then(() => {
                    if (message.channel.type === "dm") return;
                    message.reply(`I\'ve sent you a DM about ${com.name}`);
                })
                .catch(error => {
                    bot.logger.error(
                        `Could not send help DM to ${message.author.tag}.\n`,
                        error
                    );
                    message.reply(
                        "it seems like I can't DM you! Do you have DMs disabled?"
                    );
                });
        }
    }
};
