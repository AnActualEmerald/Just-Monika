module.exports = {
    name: "ban",
    description: "bans a user",
    perms: ["BAN_MEMBERS"],
    args: true,
    usage: "<user> <reason>",
    cooldown: 1500,
    category: "Moderation",
    execute(message, args, bot) {
        var userID = args
            .shift()
            .replace("<@", "")
            .replace("!", "")
            .replace(">", "");
        var user = message.member.guild.members.get(userID);
        var reason = args.join(" ");

        user.ban(reason)
            .then(() =>
                message.channel.send(`Banned <@${userID}> for \`${reason}\``)
            )
            .catch(err => {
                bot.logger.error(`Error banning ${user.user.username}: ${err}`);
                message.channel.send(
                    `COULD'T BAN <@${userID}>, THEY'RE TOO POWERFUL`
                );
            });
    }
};
