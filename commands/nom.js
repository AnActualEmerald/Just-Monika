module.exports = {
	name: "nom",
	description: "How many burritos have been eaten",
	args: false,
	execute(msg, args, bot){
		globalVar.burritosEaten = (bot.globalVar.burritosEaten + 1);
		msg.channel.send('OM NOM NOM tasty burrito. I\'ve eaten ' + globalVar.burritosEaten + ' burritos').catch(bot.logger.error);
	},
};
