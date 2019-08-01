var thumbsup = '👍';

module.exports = {
	name: 'nice',
	description: 'Thumbs up, bruh',
	args: false,
	execute(message, args, bot){
		message.react(thumbsup).catch(bot.logger.error);
	},
};
