const operations = ["add", "remove", "edit", "list"];

editCommand = {
    description: "Edit an existing custom command",
    execute(message, args, bot) {
        const command = args.shift().replace(bot.prefix, "");

        bot.customComs.set(command, args.join(" "));

        message.channel.send(`Updated ${command}`);

        bot.updateJSON(bot.ccFile, bot.collectionToJSON(bot.customComs));
    }
};

remove = {
    execute(message, args, bot) {
        const command = args.shift().replace(bot.prefix, "");

        if (!bot.customComs.has(command))
            return message.reply(`No such command ${command} to remove, sorry`);

        bot.customComs.delete(command);

        message.channel.send(`Command ${command} removed`);

        bot.updateJSON(bot.ccFile, bot.collectionToJSON(bot.customComs));
    }
};

add = {
    execute(message, args, bot) {
        const command = args.shift();
        const text = args.join(" ");

        //	if(!command.startsWith(bot.prefix)) return message.reply(`Commands need to start with ${bot.prefix}`);

        bot.customComs.set(command.replace(bot.prefix, ""), text);

        message.channel.send(`Command ${command} added`);

        bot.updateJSON(bot.ccFile, bot.collectionToJSON(bot.customComs));
    }
};

list = {
    execute(message, args, bot) {
        Discord = require("discord.js");
        var embed = new Discord.RichEmbed().setTitle("Custom Commands: ");
        var keys = bot.customComs.keyArray();
        var c = [];
        console.log(keys);
        for (var i = 0; i < keys.length; i++) {
            c.push(keys[i]);
        }
        embed.description = c.toString().replace(/,/g, "\n");

        message.channel.send(embed);
    }
};

module.exports = {
    name: `custom`,
    description: `handle custom commands, only use the third argument when adding a command`,
    args: true,
    subcommands: { remove: remove, add: add, list: list, edit: editCommand },
    alias: [`cc`],
    usage: `<add|remove|edit|list> <command name> | <command text>`,
    category: "Utilities",
    detailed:
        "Add: add a new custom command (eg: !custom add hellothere genral kenobi)\n" +
        "Remove: remove a custom command by name (eg: !custom remove hellothere)\n" +
        "Edit: change the response a command gives when called (eg: !custom edit hellothere you are a bold one)\n" +
        "List: list all of the current custom commands, currently a global list for every server (eg: !custom list)",
    execute(message, args, bot) {
        var mode = args.shift();
        //     if (!operations.includes(mode)) {
        bot.logger.warn("Invalid mode");
        return message.reply(`${mode} isn't a valid operaton`);
        //    }

        if (mode == operations[0]) {
        }

        if (mode == operations[1]) {
        }

        if (mode == operations[2]) {
        }

        if (mode == operations[3]) {
        }
    }
};
