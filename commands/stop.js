module.exports = {
	name: "stop",
	description: "Stops the current instance of the bot",
	args: false,
	admin: true,
	execute(message, args, bot){
		if(!message.member.hasPermission('ADMINISTRATOR')){
			message.reply('you don\'t have permission to use this command');
			reutrn;
		}else{
			message.channel.send("Stopping bot");
			bot.logger.info('stop requested by ' + message.author.username);
			bot.destroy();

		}
	},


};
