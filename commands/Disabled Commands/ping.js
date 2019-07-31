module.exports = {
	name:'ping',
	description:'displays a user\'s ping',
	args:true,
	usage:'<user>',
	cooldown:1500,
	execute(message, args, bot){
		var userID = args[0].replace('<@', '').replace('>', '').replace('!', '');
		var user = message.member.guild.members.get(userID);
		var userPing = Math.round(user.client.ping);
		message.channel.send(`PONG! ${user}'s ping is ${userPing}ms`)
	},
};