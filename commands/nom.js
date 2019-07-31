module.exports = {
	name: "nom",
	description: "How many burritos have been eaten",
	args: false,
	execute(msg, args, client){
		var globalVar = require('./cmdVars.json');
		globalVar.burritosEaten = (parseInt(globalVar.burritosEaten) + 1);
		msg.channel.send('OM NOM NOM tasty burrito. I\'ve eaten ' + globalVar.burritosEaten + ' burritos').catch(console.err);
	},
};
