module.exports = {
    name: "kick",
    description: "kicks a user",
    perms: ["KICK_MEMBERS"],
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
        var user = message.member.guild.members.resolve(userID);
        var reason = args.join(" ");

        user.kick(reason)
            .then(() =>
                message.channel.send(`Kicked <@${userID}> for \`${reason}\``)
            )
            .catch((err) => {
                bot.logger.error(`Error kicking ${user.user.username}: ${err}`);
                message.channel.send(
                    `COULD'T KICK <@${userID}>, THEY'RE TOO POWERFUL`
                );
            });
    },
};
