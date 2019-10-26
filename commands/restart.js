module.exports = {
	name: 'restart',
	description: 'Restarts the bot',
	args: false,
	perms:['OWNER'],
	execute(message, args, bot){
		const token = bot.auth;
		message.channel.send("Restarting bot");
		bot.destroy();
		bot.login(token);
	},
};