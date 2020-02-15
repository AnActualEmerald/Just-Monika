module.exports = {
    name: `getaddlink`,
    args: false,
    alias: ["addlink", "invite"],
    description: `Returns the link used to add the bot to a server`,
    usage: "",
    category: "Utilities",
    execute(message, args, bot) {
        message.channel.send(
            `https://discordapp.com/oauth2/authorize?&client_id=543307204644700170&scope=bot&permissions=134537286`
        );
    }
};
