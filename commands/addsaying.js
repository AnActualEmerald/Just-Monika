module.exports = {
	name: 'addsaying',
	description: 'Adds a saying for the bot. Add -c to make it case sensitive',
	args: true,
	admin: true,
	usage: '"<saying>" <option> <text>',
	execute(message, args, bot){
		var con = args.toString().replace(/,/g, ' ').split(/"/g);
		var saying = con[1];
		var t = con[2].trim();

		bot.logger.debug(con);
		bot.logger.debug(saying);
		bot.logger.debug(t);

		if(t.startsWith('-c')){
			t = t.replace('-c ', '');
			bot.sayings[saying] = {sens: true, text: t};
		}else{
			bot.sayings[saying.toLowerCase()] = {text: t};
		}

		message.reply(`Saying \`${saying}\` added`);
	},


};
