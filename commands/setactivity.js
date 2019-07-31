module.exports = {
	name:'setactivity',
	description:'set the current activity for the bot',
	args:true,
	usage:'<activity>',
	admin:true,
	execute(message, args, bot){
		bot.globalVar.activity = args.toString().replace(/,/g, " ")
		bot.user.setActivity(bot.globalVar.activity);
		message.channel.send({embed:{description:'Activity set'}}).catch(console.err);
	},
};
