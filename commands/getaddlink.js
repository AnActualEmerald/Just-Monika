module.exports = {
	name:`getaddlink`,
	admin:false,
	args:false,
	alias:['addlink'],
	description:`Returns the link used to add the bot to a server`,
	usage:'',
	execute(message, args, bot){
		message.channel.send(`https://discordapp.com/oauth2/authorize?&client_id=543307204644700170&scope=bot&permissions=134537286`);
	},

};