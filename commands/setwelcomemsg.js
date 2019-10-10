module.exports = {
		name:'setwelcomemsg',
		admin:true,
		args:true,
		alias:['setwmsg', 'welcomemsg'],
		description:'Changes the server\'s welcome message. Use <@${user.id}> to mention the new uers. Or, use &{user.username} to just display their name and not mention them.',
		usage:'<text>',
		execute(message, args, bot){
			var msg = args.join(" ");
			var guildName = message.member.guild.id;
			bot.logger.debug("Guild name: " + guildName);
			var strGuilds = JSON.stringify(bot.myGuilds);
			bot.logger.debug(`bot.guilds ${strGuilds}`);
			bot.myGuilds[guildName].welcomeMessage = msg;

			message.channel.send(`Set welcome message to ${bot.myGuilds[guildName].welcomeMessage}`);
		},
}
