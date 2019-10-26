module.exports = {
	name:'setactivity',
	description:'set the current activity for the bot',
	args:true,
	usage:'<activity>',
	perms:['OWNER'],
	execute(message, args, bot){
		bot.globalVar.activity = args.join(" ");
		bot.user.setActivity(bot.globalVar.activity);
		message.channel.send({embed:{description:'Activity set'}}).catch(console.err);
	},
};
