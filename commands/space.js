module.exports = {
    name: "space",
    alias: ["shoo"],
    description: "makes some space with ascii art of space",
    args: false,
    usage: "",
    cooldown: 5000,
    category: "Fun",
    execute(message, args, bot) {
        var pasta = require("./pasta.json");
        message.channel.send(pasta.space1);
    }
};
