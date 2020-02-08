module.exports = {
    name: "purge",
    alias: [],
    args: true,
    usage: "<count>",
    perms: ["MANAGE_MESSAGES"],
    execute(message, args, bot) {
        count = args.shift();
        channel = message.channel;

        channel
            .fetchMessages({ before: message.id, limit: count })
            .then(col => {
                channel.bulkDelete(col);
                message.delete();
            });
    }
};
