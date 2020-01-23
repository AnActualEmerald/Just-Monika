module.exports = {
    name: "cube",
    alias: [""],
    description: "Have some nice jelly belly pet rat gummy candy",
    usage: "<text>",
    execute(message, args, bot) {
        let con = args.join(" ");
        let result = con
            .replace(/ is /g, " īce ")
            .replace(/oy/g, "ȯi")
            .replace(/ay/g, "ī")
            .replace(/[iy]/g, "ī")
            .replace(/e/g, "ē");

        message.channel.send(result);
    }
};
