module.exports = {
	name: 'restart',
	description: 'Restarts the bot',
	args: false,
	admin: true,
	execute(message, args, bot){
		const token = bot.auth;
		message.channel.send("Restarting bot");
		bot.destroy();
		bot.login(token);
	},
};