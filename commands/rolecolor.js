const Discord = require("discord.js");


module.exports = {
    name: 'rolecolor',
    description: 'See or set the hex color value of a role',
    args: true,
    usage: '<role> [color]',
    perms: ['MANAGE_ROLES'],
    category: 'Utilities',
    execute(message, args, bot){
        if(args.length == 1){
            r = message.mentions.roles.first();
            let embed = new Discord.MessageEmbed();
            embed.setColor(r.hexColor);
            embed.setDescription(`Color: ${r.hexColor}`);
            message.channel.send(`Role color for ${r}`, {embed: embed});
        }

        if(args.length == 2){
            r = message.mentions.roles.first();
            r.setColor(`#${args[1]}`).then(update => {
                let embed = new Discord.MessageEmbed();
                embed.setColor(update.hexColor);
                embed.setDescription(`Color: ${update.hexColor}`);
                
                message.channel.send(`Role color for ${update}`, {embed: embed});
            });

            
        }
    }

}