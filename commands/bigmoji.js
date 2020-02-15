function animatedEmoji(emoji) {
    //needs to return the biiiig gif
    var id = emoji.split(":")[2].replace(">", "");
    return "https://cdn.discordapp.com/emojis/" + id + ".gif";
}

function normalEmoji(emoji) {
    //needs to return the biiiig png
    var id = emoji.split(":")[2].replace(">", "");
    return "https://cdn.discordapp.com/emojis/" + id + ".png";
}

module.exports = {
    name: "bigmoji",
    description: "Shows big image for emojis, doesn't work for unicode 👏",
    args: true,
    usage: "<emoji>",
    cooldown: 1500,
    category: "Utilities",
    execute(message, args, bot) {
        var emoji = args.shift();
        var img;

        if (!emoji.startsWith("<"))
            return message.channel.send("I can't get that emoji");

        if (emoji.startsWith("<a")) img = animatedEmoji(emoji);
        else img = normalEmoji(emoji);

        message.channel.send({ files: [img] });
    }
};
