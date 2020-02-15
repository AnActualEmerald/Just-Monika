module.exports = {
    name: "feelsbadman",
    description: "sends a pepe meme",
    alias: [],
    args: false,
    usage: "",
    category: "Fun",
    execute(message, args, bot) {
        message.channel.send("F", { files: ["./commands/res/pepeMeme.jpg"] });
    }
};
