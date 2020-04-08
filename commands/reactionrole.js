const client = require("../bot.js");
const Discord = require("discord.js");
let sentMsgs = require("../messages.json");
let groups = require("./reactgroups.json");

let roleMsg = {
    message: "",
    roles: [],
};

newmsg = {
    execute(message, args, bot) {
        roleMsg = {
            name: args.shift(),
            message: args.join(" "),
            roles: [],
        };
        message.channel.send(
            `Created new role message ${roleMsg.name}: ${roleMsg.message}`
        );
        groups[roleMsg.name] = roleMsg;
        client.updateJSON("./reactgroups.json", groups);
    },
};

role = {
    execute(message, args, bot) {
        let emoji = args.shift();
        let r = message.mentions.roles.first();
        roleMsg.roles.push({ role: r, emoji: emoji });
        message.channel.send(`Added ${r} to message with ${emoji} emoji`);
        groups[roleMsg.name] = roleMsg;
        client.updateJSON("./reactgroups.json", groups);
    },
};

edit = {
    execute(message, args, bot) {
        let name = args.shift();
        if (groups[name]) {
            roleMsg = groups[name];
        } else {
            message.channel.send("Couldn't find a group called " + name);
            bot.logger.error("Couldn't find reaction role group caled " + name);
            return;
        }

        embed = new Discord.MessageEmbed();
        embed.setTitle(`Current role message: ${roleMsg.name}`);
        embed.setDescription(`${roleMsg.message}`);
        roleMsg.roles.forEach((elem) => {
            embed.addField(`${elem.emoji}`, `${elem.role.name}`);
        });
        embed.setColor(message.member.displayColor);
        message.channel.send(embed);
    },
};

list = {
    execute(message, args, bot) {
        embed = new Discord.MessageEmbed()
            .setTitle("Current reaction role groups: ")
            .setDescription(`Currently editing ${roleMsg.name || "none"}`);
        for (e in groups) {
            embed.addField("Name: ", e);
        }

        embed.addField("Active role messages: ", "--------------------");
        for (e in sentMsgs) {
            embed.addField("ID: ", e);
        }

        message.channel.send(embed);
    },
};

send = {
    execute(message, args, bot) {
        let thisRoleMsg = groups[args[args.indexOf("-g") + 1]] || roleMsg;
        let channel = message.mentions.channels.first() || message.channel;
        channel.send(thisRoleMsg.message).then((m) => {
            thisRoleMsg.roles.forEach((elem) => {
                m.react(elem.emoji);
            });
            sentMsgs[m.id] = {
                id: m.id,
                roles: thisRoleMsg.roles,
            };
            client.updateJSON("./messages.json", sentMsgs);
            load();
        });
    },
};

remove = {
    execute(message, args, bot) {
        if (args.includes("-g")) {
            g = args[args.indexOf("-g") + 1];
            delete groups[g];
            message.channel.send("Removed group " + g);
            return;
        } else if (args.includes("-a")) {
            sentMsgs = {};
            client.updateJSON("./messages.json", sentMsgs);
            message.channel.send("Removed all active role messages");
            return;
        }
        let id = args.shift();
        delete sentMsgs[id];
        client.updateJSON("./messages.json", sentMsgs);
        client.commands.get("reload").execute(message, args, bot);
    },
};

module.exports = {
    name: "reactionrole",
    alias: ["rr"],
    category: "Utilities",
    args: true,
    description: "set up and send reaction role messages",
    subcommands: {
        send: send,
        role: role,
        new: newmsg,
        remove: remove,
        edit: edit,
        list: list,
    },
    execute(message, args, bot) {
        let prefix = bot.myGuilds[message.guild.id].prefix;
        message.channel.send(`Do ${prefix}help reactionrole for info`);
    },
    load: load,
};

function load() {
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
                roleObj.roles.forEach((e) => {
                    client.logger.info("Looping again");
                    if (reaction.emoji.name == e.emoji && !user.bot) {
                        reaction.message.guild.members
                            .fetch(user)
                            .then((member) => {
                                member.roles.add(e.role.id);
                            })
                            .then(() =>
                                user.send(`I gave you the ${e.role.name} role`)
                            )
                            .catch((e) => {
                                user.send(`Couldn't give you that role`);
                                client.logger.error(
                                    `Couldn't give user ${user.name} role ${e.role.name}`
                                );
                                client.loger.error(e);
                            });
                    }
                });
            }
        });
        client.addEventListener("messageReactionRemove", (reaction, user) => {
            if (reaction.message.id === roleObj.id) {
                roleObj.roles.forEach((e) => {
                    if (reaction.emoji.name == e.emoji && !user.bot) {
                        reaction.message.guild.members
                            .fetch(user)
                            .then((member) => member.roles.remove(e.role.id))
                            .then(() =>
                                user.send(`I removed the ${e.role.name} role`)
                            )
                            .catch((e) => {
                                user.send(
                                    `Couldn't remove that role for some reason`
                                );
                                client.logger.error(
                                    `Couln't remove role ${e.role} from user ${user}`
                                );
                                client.logger.error(e);
                            });
                    }
                });
            }
        });
    }
}
