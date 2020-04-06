const shell = require("shelljs");

module.exports = {
    name: "shell",
    description: "run shell commands on the bot's host",
    args: true,
    usage: "<command>",
    perms: ["OWNER"],
    category: "Management",
    execute(message, args, bot) {
        cmd = args.join(" ");
        // bot.logger.debug(cmd);
        res = shell.exec(cmd);
        // bot.logger.debug(`got result: ${res}`);
        message.channel.send(`${res}`).catch(bot.logger.error);
    },
};
