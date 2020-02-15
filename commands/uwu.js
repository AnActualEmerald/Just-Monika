const uwuOptions = [
    "UwU",
    "Uwu",
    "uwU",
    "ÚwÚ",
    "uwu",
    "☆w☆",
    "✧w✧",
    "♥w♥",
    "︠uw ︠u",
    "(uwu)",
    "OwO",
    "owo",
    "Owo",
    "owO"
];

module.exports = {
    name: "uwu",
    alias: [],
    description: "Translates text into uwu UwU",
    admin: false,
    args: true,
    usage: "<text>",
    cooldown: 500,
    category: "Fun",
    execute(message, args, bot) {
        var t = args.join(" ");
        var res = t.replace(/l|r/g, "w").replace(/L|R/g, "W"); //Get basic uwuing out of the way
        res = res
            .replace(/the /g, "da ")
            .replace(/The /g, "Da ")
            .replace(/THE /g, "DA ");
        res = res.replace(/th/g, "d").replace(/Th|TH/g, "D"); //Then add more advanced uwuing
        res =
            res +
            " " +
            uwuOptions[Math.floor(Math.random() * (uwuOptions.length - 1))];
        message.channel.send(res);
    }
};
