const Git = require("nodegit");
const Discord = require("discord.js");
module.exports = {
    name:'gitpull',
    alias:['gp', 'pull'],
    description:'Refreshes the git repository the bot is running from on the remote server',
    admin:true,
    args:false,
    category:'management',
    execute(message, args, bot){
        pullRepo(message, bot);
    },
}

function pullRepo(message, bot){
    Git.Repository.open("Just-Monika").then(repo => {
        repo.fetch("origin").then(
            repo.mergeBranches("master", "remotes/origin/master").then(d=>{
                bot.logger.info("Pulled repo successfully");
                var embed = Discord.RichEmbed().setTitle("Pulled from repository").setColor('DARK_PURPLE');
                message.channel.send(embed);
                return;
            }).catch(e => bot.logger.error("Merge Failed: " + e))
        ).catch(e => bot.logger.error("Fetch Failed: " + e));
    }).catch(bot.logger.error);
    message.channel.send("Something went wrong, check the logs");
}