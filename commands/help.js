const {RichEmbed} = require('discord.js');

module.exports = {
	name: "help",
	description: "show all commands and their variables",
	args: false,
	alias: '',
	execute(message, args, bot){
		var data = [];
		if(!args.length)
		{
			var count = 0;
			var embed = new RichEmbed().setTitle("Here's a list of my commands: ").setColor(message.member.displayColor);

			bot.commands.forEach((value, key) => {
				if(count >= 25) {data.push(embed); embed = new RichEmbed().setColor(message.member.displayColor); count = 0;}
				embed.addField(key, value.description);
				count++;
			});
			data.push(embed);
			data[data.length - 1].setFooter(`You can send \`${bot.prefix}help [command name]\` to get info on a specific command!`);

			return data.forEach(val => message.author.send(val)	.catch(error => {
				bot.logger.error(`Could not send help DM to ${message.author.tag}.\n`, error);
				message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
			}));
		}

		const com = bot.commands.get(args[0]);
		data.push(`Info about ${com.name}`);
		data.push(`Usage: ${bot.prefix}${com.name} ${com.usage}`);
		data.push(`Aliases: ${com.alias}`);

		if(com.cooldown)
			data.push(`Cool-down: ${com.cooldown/1000}s`);

		data.push(`${com.description}`);

		return message.author.send(data, {split: true})
			.then(() => {
			if (message.channel.type === 'dm') return;
				message.reply(`I\'ve sent you a DM about ${com.name}`);
			})
			.catch(error => {
				bot.logger.error(`Could not send help DM to ${message.author.tag}.\n`, error);
				message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
		});
	},

};
