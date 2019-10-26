const operations = ['add', 'remove', 'edit', 'list'];

module.exports = {
	name:`custom`,
	description:`handle custom commands, only use the third argument when adding a command`,
	args:true,
	alias:[`cc`],
	usage:`<add|remove|edit|list> <command name> | <command text>`,
	execute(message, args, bot){
		var mode = args.shift();
		if(!operations.includes(mode)){
			bot.logger.warn('Invalid mode');
			return message.reply(`${mode} isn't a valid operaton`);
		}

		if(mode == operations[0]){
			const command = args.shift();
			const text = args.join(" ");

		//	if(!command.startsWith(bot.prefix)) return message.reply(`Commands need to start with ${bot.prefix}`);

			bot.customComs.set(command.replace(bot.prefix, ''), text);


			message.channel.send(`Command ${command} added`);
		}

		if(mode == operations[1]){
			const command = args.shift().replace(bot.prefix, '');

			if(!bot.customComs.has(command)) return message.reply(`No such command ${command} to remove, sorry`);

			bot.customComs.delete(command);

			message.channel.send(`Command ${command} removed`);
		}

		if(mode == operations[2]){
			const command = args.shift().replace(bot.prefix, '');

			bot.customComs.set(command, args.join(" "));

			message.channel.send(`Updated ${command}`)

		}

		if(mode == operations[3]){
			Discord = require('discord.js');
			var embed = new Discord.RichEmbed().setTitle("Custom Commands: ");
			var keys = bot.customComs.keyArray();
			var c = [];
			console.log(keys);
			for(var i = 0; i < keys.length; i++){
				c.push(keys[i]);
			}
			embed.description = c.toString().replace(/,/g, '\n');

			message.channel.send(embed);
		}

		bot.updateJSON(bot.ccFile, bot.collectionToJSON(bot.customComs));
	},



};
