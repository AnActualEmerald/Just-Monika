const client = require("../bot.js");

let sentMsgs = [];

let roleMsg = {
    message: "",
    roles: []
};

/* let roleObj = {
    role,
    emoji
}; */

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
            sentMsgs.push({ id: m.id, msg: thisRoleMsg });
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
        });
    }
};

module.exports = {
    name: "reactionrole",
    alias: ["rr"],
    category: "Utilities",
    args: true,
    description: "set up and send reaction role messages",
    subcommands: { send: send, role: role, newmsg: newmsg },
    execute(message, args, bot) {},
    reload() {}
};
