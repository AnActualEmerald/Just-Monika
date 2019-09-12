module.exports = {
    name:'opento',
    alias:['open', 'openfor'],
    description:'Allows a roll or member to type in the channel called in',
    args:true,
    admin:true,
    usage:'<user|role>',
    cooldown:1000,
    execute(message, args, bot){
        var user = message.mentions.users.first();
        var role = message.mentions.roles.first();
        bot.logger.debug(`User:${user} Role:${role}`);
        if(user != null){
            bot.logger.info(`Overwriting permissions for ${user}`);
            message.channel.overwritePermissions(user, {SEND_MESSAGES:true})
                .then(channel => channel.send(`Updated permissions for this channel`))
                .catch(bot.logger.error);
        }
        if(role != null){
            bot.logger.info(`Overwriting permissions for ${role}`);
            message.channel.overwritePermissions(role, {SEND_MESSAGES:true})
                .then(channel => channel.send(`Updated permissions for this channel`))
                .catch(bot.logger.error);
        }
        if(message.mentions.everyone){
            bot.logger.info(`Overwriting permissions for ${message.guild.defaultRole}`);
            message.channel.overwritePermissions(message.guild.defaultRole, {SEND_MESSAGES:true})
                .then(channel => channel.send(`Updated permissions for this channel`))
                .catch(bot.logger.error);
        }
    },
}
