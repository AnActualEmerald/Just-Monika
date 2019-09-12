const modes = ['message', 'add', 'send', 'reset'];
const reactf_location = './reactrole.json';

var reactFile = require(reactf_location);

function buildFile(id){
    reactFile[id] = {
        'message':'',
        'roles':[],
        'message_id':0
    };

    return reactFile;
}

function reactSetup(id, bot){
    var roles = reactFile[id].roles;
    for(var r in roles){
        var emoji = r.emoji;
        bot.logger.debug(emoji);
    }
}

module.exports = {
    name:'reactrole',
    alias:[],
    description:'set up a message for giving roles based on reactions',
    admin:true,
    args:true,
    usage:'<mode> <parameters>',
    cooldown:1000,
    execute(message, args, bot){
        var mode = args.shift();
        var guild_id = message.guild.id;

        if(!reactFile[guild_id]){
        //    buildFile(guild_id);
        }

        if(mode === modes[0]){
            reactFile[guild_id].message = args.toString().replace(/,/g, ' ');
            bot.logger.info(`Set reaction message for ${message.guild.name} to ${args.toString().replace(/,/g, ' ')}`);
            message.reply('message set');
        }else if(mode === modes[1]){
            var role  = message.mentions.roles.first();
            do{
                args.shift();
            }while(!args[0].startsWith('<'));

            var emoji = args[0];
            reactFile[guild_id].roles.push({role:role,emoji:emoji});
            bot.logger.info(`Added role`);
            message.reply('role and reaction added');
        }else if(mode === modes[2]){
            message.channel.send(reactFile[guild_id].message)
                .then(sent => {
                    bot.logger.info(`Sent reactrole message for ${message.guild.name}`);
                    reactFile[guild_id].message_id = sent.id;
                    reactSetup(guild_id, bot);
                });
        }else if(mode === modes[3]){
            reactFile = buildFile(guild_id);
            message.reply(`Reset reactrole info for this server`);
            bot.logger.info(`Reset reactrole info for ${message.guild.name}`);
        }

        bot.updateJSON(reactf_location, reactFile);
        bot.logger.debug(`Updated reactfile`);
    },
    handle:function(reaction, user){
        //do something here
    },
}
