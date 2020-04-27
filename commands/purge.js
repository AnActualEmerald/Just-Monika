module.exports = {
    name: "purge",
    alias: [],
    args: true,
    usage: "<count>",
    perms: ["MANAGE_MESSAGES"],
    category: "Moderation",
    execute(message, args, bot) {
        count = args.shift();
        channel = message.channel;

        channel.messages
            .fetch({ before: message.id, limit: count })
            .then((col) => {
                channel.bulkDelete(col);
                message.delete();
            });
    },
};
