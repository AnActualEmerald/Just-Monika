var thumbsup = "👍";

module.exports = {
    name: "nice",
    description: "Thumbs up, bruh",
    args: false,
    category: "Fun",
    execute(message, args, bot) {
        message.react(thumbsup).catch(bot.logger.error);
    }
};
