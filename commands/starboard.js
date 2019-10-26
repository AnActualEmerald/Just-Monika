const operations = ['emoji', 'channel', 'ignore', 'threshold'];

module.exports = {
    name: 'starboard',
    alias: ['setstar', 'setstaremoji'],
    description: 'Starboard manager. See documentation for detailed info',
    perms:['MANAGE_GUILD'],
    args: true,
    usage: '<emoji|channel|ignore|threshold> <param>',
    execute(message, args, bot){
        var mode = args.shift();
        if(!operations.includes(mode)){
            bot.logger.warn(`Invalid starboard operation: ${mode}`);
            message.channel.send(`${mode} isn't a valid operation!`);
        }

        if(mode == operations[0]){
            var emoji = args.shift();
            bot.myGuilds[message.guild.id].star_emoji = emoji;
            bot.logger.info(`Set starboard emoji for ${message.guild.name} to ${emoji.name}`);
            message.channel.send(`Set starboard emoji to ${emoji}`);
        }

        if(mode == operations[1]){
            var chan = args.shift();
            if(chan){
                bot.myGuilds[message.guild.id].starboard_chan = chan.id;
                bot.logger.info(`Set starboard channel for ${message.guild.name} to ${chan.id}`);
                message.channel.send(`Starboard channel set to ${chan}`);
            }else{
                bot.myGuilds[message.guild.id].starboard_chan = message.channel.id;
                bot.logger.info(`Set starborad channel for ${message.guild.name} to ${message.channel.name}`);
                message.channel.send(`Starboard channel set to ${message.channel}`);
            }
        }

        if(mode == operations[2]){
            var chan = args.shift();

            if(chan){
                if(bot.myGuilds[message.guild.id].ignore.includes(chan))
                {
                    var i = bot.myGuilds[message.guild.id].ignore.indexOf(chan.name);
                    bot.myGuilds[message.guild.id].ignore.splice(i);
                    bot.logger.info(`Enabled starboard for ${chan}`);
                    message.channel.send(`Enabled starboard in ${chan}`);
                }else{
                    bot.myGuilds[message.guild.id].ignore.push(chan);
                    bot.logger.info(`Starboard disabled for ${message.guild.name} channel ${message.channel}`);
                    message.channel.send(`Starboard disabled in ${chan}`);
                }
            }else{
                if(bot.myGuilds[message.guild.id].ignore.includes(message.channel.id))
                {
                    var i = bot.myGuilds[message.guild.id].ignore.indexOf(message.channel.id);
                    bot.myGuilds[message.guild.id].ignore.splice(i);
                    bot.logger.info(`Enabled starboard for ${message.channel}`);
                    message.channel.send(`Enabled starboard in ${message.channel}`);
                }else{
                    bot.myGuilds[message.guild.id].ignore.push(message.channel.id);
                    bot.logger.info(`Starboard disabled for ${message.guild.name} channel ${message.channel}`);
                    message.channel.send(`Starboard disabled in ${message.channel}`);
                }
            }
        }

        if(mode == operations[3]){
            var count = args.shift();
            bot.myGuilds[message.guild.id].star_lvl = count;
            bot.logger.info(`Set starboard threshold in ${message.guild.name} to ${count}`);
            message.channel.send(`Starboard now requires ${count} reactions`);
        }
    },
}
