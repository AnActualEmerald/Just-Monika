module.exports = {
    name: 'setwelcomechannel',
    alias: ['setwc', 'welcomechannel'],
    args: false,
    description: 'Sets where the channel that the bot sends welcome messages to',
    usage: '',
    cooldown: 1500,
    perms:['MANAGE_GUILD'],
    execute(message, args, bot){
        var guildName = message.member.guild.id;
        bot.myGuilds[guildName].welcomeChannel = message.channel.name;
        message.channel.send(`Welcome messages will now be sent to ${message.channel.name}`)
            .then(message => message.delete(5000));
    }
}
