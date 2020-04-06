const client = require("../bot.js");
const users = require("./lastseen.json");
const online = ["online", "idle", "dnd"];

module.exports = {
    name: "lastseen",
    alias: ["ls"],
    args: true,
    usage: "<user | id>",
    description:
        "See the time a user went offline. Works with IDs so you don't have to ping.",
    category: "Utilities",
    execute(message, args, bot) {
        let id;
        if (message.mentions.users.size > 0) {
            id = message.mentions.users.first().id;
        } else {
            id = args.shift();
        }

        message.guild.members
            .fetch(id)
            .then((member) => {
                if (online.includes(member.presence.status)) {
                    message.channel.send(`${member.displayName} is online`);
                } else {
                    message.channel.send(
                        `${member.displayName}(${id}) last seen at ${users[id]}`
                    );
                }
            })
            .catch((e) => {
                message.channel.send(
                    `There seems to be a problem getting that user`
                );
            });
    },
    load() {
        client.addEventListener("presenceUpdate", (oPres, nPres) => {
            if (online.includes(nPres.status)) {
                delete users[nPres.userID];
                client.updateJSON("./lastseen.json", users);
            } else if (nPres.status === "offline") {
                users[nPres.userID] = new Date(Date.now()).toUTCString();
                client.updateJSON("./lastseen.json", users);
            }
        });
    },
};
