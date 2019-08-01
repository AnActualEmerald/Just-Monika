module.exports = {
	name:'reload',
	description:'reloads the bot\'s commands',
	alias:[],
	admin:true,
	args:false,
	usage:'',
	cooldown:'3000',
	execute(message, args, bot){
		try{
			bot.loadCmds(message);
			message.channel.send({embed:{description:'Reloaded all commands'}});
		}catch(err){
			bot.logger.error(`Couldn't reload commands`)
			bot.logger.error(err);
		}
	},
};
