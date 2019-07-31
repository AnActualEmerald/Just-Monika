module.exports = {
	name: "help",
	description: "show all commands and their variables (command-specific help coming soon^TM)",
	args: false,
	alias: '',
	execute(message, args, bot){
		var data = [];
		if(!args.length)
		{
	
			data.push('Here\'s a list of all my commands:');
			data.push(bot.commands.map(command => command.name).join(',\n'));
			data.push(`\nYou can send \`${bot.prefix}help [command name]\` to get info on a specific command!`);

			return message.author.send(data, {split: true})
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
			.catch(error => {
				console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
				message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
			});
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
				console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
				message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
		});
	},
	
};