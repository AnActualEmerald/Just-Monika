const client = require("../bot.js");
let sentMsgs = require("../messages.json");

let roleMsg = {
    message: "",
    roles: []
};

newmsg = {
    execute(message, args, bot) {
        roleMsg = {
            message: args.join(" "),
            roles: []
        };
        message.channel.send(`Created new role message: ${roleMsg.message}`);
    }
};

role = {
    execute(message, args, bot) {
        let emoji = args.shift();
        let r = message.mentions.roles.first();
        roleMsg.roles.push({ role: r, emoji: emoji });
        message.channel.send(`Added ${r} to message with ${emoji} emoji`);
    }
};

send = {
    execute(message, args, bot) {
        let thisRoleMsg = roleMsg;
        let channel = message.mentions.channels.first() || message.channel;
        channel.send(thisRoleMsg.message).then(m => {
            thisRoleMsg.roles.forEach(elem => {
                m.react(elem.emoji);
            });
            sentMsgs[m.id] = {
                id: m.id,
                roles: thisRoleMsg.roles
            };
            client.updateJSON("./messages.json", sentMsgs);
            client.addEventListener("messageReactionAdd", (reaction, user) => {
                if (reaction.message.id === m.id) {
                    thisRoleMsg.roles.forEach(e => {
                        if (reaction.emoji == e.emoji && !user.bot) {
                            reaction.message.guild
                                .fetchMember(user)
                                .then(member => member.addRole(e.role));
                            user.send(`I gave you the ${e.role.name} role`);
                        }
                    });
                }
            });
            client.addEventListener(
                "messageReactionRemove",
                (reaction, user) => {
                    if (reaction.message.id === m.id) {
                        thisRoleMsg.roles.forEach(e => {
                            if (reaction.emoji == e.emoji && !user.bot) {
                                reaction.message.guild
                                    .fetchMember(user)
                                    .then(member => member.removeRole(e.role));
                                user.send(`I removed the ${e.role.name} role`);
                            }
                        });
                    }
                }
            );
        });
    }
};

module.exports = {
    name: "reactionrole",
    alias: ["rr"],
    category: "Utilities",
    args: true,
    description: "set up and send reaction role messages",
    subcommands: { send: send, role: role, new: newmsg },
    execute(message, args, bot) {},
    load() {
        for (i in sentMsgs) {
            let roleObj = sentMsgs[i];
            client.logger.info("Looping");
            client.addEventListener("messageReactionAdd", (reaction, user) => {
                client.logger.info("Tripping");
                client.logger.info(
                    `React ID: ${reaction.message.id}, old msg ID: ${roleObj.id}`
                );
                if (reaction.message.id === roleObj.id) {
                    client.logger.info("ID matching");
                    roleObj.roles.forEach(e => {
                        client.logger.info("Looping again");
                        if (reaction.emoji == e.emoji && !user.bot) {
                            reaction.message.guild
                                .fetchMember(user)
                                .then(member => {
                                    member.addRole(e.role);
                                });
                            user.send(`I gave you the ${e.role.name} role`);
                        }
                    });
                }
            });
            client.addEventListener(
                "messageReactionRemove",
                (reaction, user) => {
                    if (reaction.message.id === roleObj.id) {
                        roleObj.roles.forEach(e => {
                            if (reaction.emoji == e.emoji && !user.bot) {
                                reaction.message.guild
                                    .fetchMember(user)
                                    .then(member => member.removeRole(e.role));
                                user.send(`I removed the ${e.role.name} role`);
                            }
                        });
                    }
                }
            );
        }
    }
};
