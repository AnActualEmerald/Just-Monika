module.exports = {
	name: 'fuck',
	description: 'fuck that thing',
	args: true,
	usage: '<anything>',
	execute(message, args, bot)
	{
		const a = args.toString().replace(/,/g, ' ');
		message.channel.send(`Yeah dude just like fuck ${a}`);
	},
};