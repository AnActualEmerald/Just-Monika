const shell = require("shelljs");
const Discord = require("discord.js");
module.exports = {
    name: "gitpull",
    alias: ["gp", "pull"],
    description:
        "Refreshes the git repository the bot is running from on the remote server",
    perms: ["OWNER"],
    args: false,
    category: "Management",
    execute(message, args, bot) {
        pullRepo(message, bot);
    }
};

function pullRepo(message, bot) {
    res = shell.exec("git pull origin master");
    bot.logger.error("Gitpull ran with result: " + res);
    message.channel.send(`Got this result: ${res}`);
}
