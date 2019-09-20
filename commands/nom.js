module.exports = {
	name: "nom",
	description: "How many burritos have been eaten",
	args: false,
	usage:'| <thing>',
	execute(msg, args, bot){
		if(args.length != 0){
			var thing = args.toString().replace(/,/g, ' ');
			var numberE = bot.globalVar[`${thing}sEaten`];
			var plur = '';
			if(!numberE) {bot.globalVar[`${thing}sEaten`] = numberE = 1}
			else{
				bot.globalVar[`${thing}sEaten`] = numberE += 1;
			}

			if(numberE>1){plur='s';}
			msg.channel.send(`OM NOM NOM tasty '${thing}'. I've eaten ${numberE} '${thing}'${plur}`).catch(bot.logger.error);
			return;
		}
		var thing = args.toString().replace(/,/g, ' ');
		bot.globalVar.burritosEaten = (bot.globalVar.burritosEaten + 1);
		msg.channel.send('OM NOM NOM tasty burrito. I\'ve eaten ' + bot.globalVar.burritosEaten + ' burritos').catch(bot.logger.error);
	},
};
