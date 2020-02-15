module.exports = {
    name: "msgcount",
    usage: "| <user>",
    description: "Shows how many messages a user has sent",
    args: false,
    category: "Utilities",
    execute(message, args, bot) {
        if (args.length != 0) {
            bot.logger.debug(`command msgcount: `);

            message.channel
                .send(args + " has sent " + bot.userVars[args] + " messages")
                .catch(console.err);
        } else {
            message.channel
                .send(
                    message.author +
                        " you've sent " +
                        bot.userVars[message.author] +
                        " messages"
                )
                .catch(console.err);
        }
    }
};
