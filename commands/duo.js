const Duolingo = require("duolingo-api");
const Discord = require("discord.js");
const util = require("util");

set = {
    name: "set",
    args: true,
    execute(message, args, bot) {
        let cred = { username: args.shift() };
        let duo = new Duolingo(cred);
        duo.getRawData().then((data) => {
            let user = data.users[0];
            let id = user.id;
            bot.userVars[message.author].duo_id = id;
            bot.updateJSON(bot.userFile, bot.userVars);
            message.channel.send(
                "Set up your duolingo account. Use the duo command to see your stats!"
            );
        });
    },
};

module.exports = {
    name: "duo",
    args: true,
    description: "Show some stats from the user's Duolingo account",
    usage: "<username>",
    subcommands: {
        set: set,
    },
    category: "Utilities",
    execute(message, args, bot) {
        let user_id = bot.userVars[message.author].duo_id;
        let prefix = bot.myGuilds[message.guild.id].prefix;
        if (!user_id) {
            message.channel.send(
                `I don't have an accoount for you! Have you done ${prefix}duo set <username> yet?`
            );

            return;
        }

        let cred = {
            id: `${user_id}`,
        };
        let duo = new Duolingo(cred);

        getMyFields(duo)
            .then((data) => {
                let lang = data.courses[0];
                let embed = new Discord.MessageEmbed()
                    .setTitle(`${message.member.displayName}'s duolingo`)
                    .setThumbnail(message.author.avatarURL())
                    .setColor("#00cc00")
                    .addField("Current streak: ", data.streak)
                    .addField("Currently learning: ", lang.title, true)
                    .addField(`Crowns: `, lang.crowns, true)
                    .addField(`Total XP: `, lang.xp, true);

                for (let i = 1; i <= 5; i++) {
                    if (i >= data.courses.length) {
                        break;
                    }
                    lang = data.courses[i];
                    embed
                        .addField("Learning ", lang.title, true)
                        .addField(`Crowns: `, lang.crowns, true)
                        .addField(`Total XP: `, lang.xp, true);
                }

                message.channel.send(embed);
            })
            .catch(bot.logger.error);
    },
};

async function getMyFields(duo) {
    let fields = [
        "streak",
        "courses",
        "learningLanguage",
        "creationDate",
        "picture",
    ];

    return await duo.getDataByFields(fields);
}
