module.exports = {
    name: "remindme",
    args: "true",
    description:
        "Sets a reminder that will go off in a certain amount of time. Time must be specified in XMXDXHXS format.",
    usage: "<time> <reminder>",
    args: true,
    category: "Utilities",
    subcommands: {},
    execute(message, args, bot) {
        let time = parseTime(args.shift());
        let reminder = args.join(" ");

        message.reply(`set reminer for ${time.toString()}`);
    }
};

function parseTime(ts) {
    const now = new Date(Date.now());

    let mIndex = ts.indexOf("M");
    let dIndex = ts.indexOf("D");
    let hIndex = ts.indexOf("H");
    let sIndex = ts.indexOf("S");

    let days = ts.slice(dIndex - 1, dIndex);
    let hours = ts.slice(hIndex - 1, hIndex);
    let minutes = ts.slice(mIndex - 1, mIndex);
    let seconds = ts.slice(sIndex - 1, sIndex);
    let months = Math.floor(days / 30);

    let total = new Date(
        now.getFullYear(),
        now.getMonth() + months,
        now.getDay() + days,
        now.getHours() + hours,
        now.getMinutes() + minutes,
        now.getSeconds() + seconds,
        now.getMilliseconds()
    );

    return total;
}
