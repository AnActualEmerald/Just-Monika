module.exports = {
		name:'setwelcomemsg',
		admin:true,
		args:true,
		alias:[],
		description:'Changes the server\'s welcome message',
		usage:'<text>',
		execute(message, args, bot){
			var msg = args.toString().replace(/,/g, ' ');
			var guildName = message.member.guild.id;
			console.log("Guild name: " + guildName);
			var strGuilds = JSON.stringify(bot.myGuilds);
			console.log(`bot.guilds ${strGuilds}`);
			bot.myGuilds[guildName].welcomeMessage = msg;
			
			message.channel.send(`Set welcome message to ${bot.myGuilds[guildName].welcomeMessage}`);
		},
}