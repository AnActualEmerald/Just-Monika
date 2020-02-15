module.exports = {
    name: "restart",
    description: "Restarts the bot",
    args: false,
    perms: ["OWNER"],
    category: "Management",
    execute(message, args, bot) {
        const token = bot.auth;
        message.channel.send("Restarting bot");
        bot.destroy();
        bot.login(token);
    }
};
