module.exports = {
    name: "cube",
    alias: [""],
    description: "Have some nice jelly belly pet rat gummy candy",
    usage: "<text>",
    category: "Fun",
    execute(message, args, bot) {
        let con = args.join(" ").toLowerCase();
        let result = con
            .replace(/ is /g, " īce ")
            .replace(/oy/g, "ȯi")
            .replace(/ay/g, "æ")
            .replace(/[iy]/g, "î")
            .replace(/e/g, "ēē")
            .replace(/u/g, "øø");

        message.channel.send(result);
    }
};
