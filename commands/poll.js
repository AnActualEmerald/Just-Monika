module.exports = {
    name:'poll',
    alias:['ask', 'p'],
    description: 'Runs a poll with specified options for specified time',
    args:true,
    usage:'"<question>" <duration> <option 1> <option 2> ... <option n>',
    cooldown:5000,
    admin:false,
    execute(message, args, bot){
        if(!args.toString().includes('"')){ message.reply('You need to put quotes around your question so that I can read it properly!'); return;} //bail out if the command seems malformed
        var question = args.toString().replace(/,/g, ' ').split(/"/g)[1];
        var qLen = args.findIndex(element => element.endsWith('"')); //find the element that ends the question
        var params = args.slice(qLen + 1);
        var duration = params.shift(); //get the duration param, only the options should be left in the params array
        var options = [];

        //do work on options
        params.forEach(element => {
            if(element.startsWith('<'))
            {
                var tmp = element.split(':')[2].replace('>', '');
                bot.logger.debug('tmp' + tmp);
                var e = bot.emojis.get(tmp);
                bot.logger.debug('e' + e);
                options.push(e);
            }else{
                options.push(element);
            }
        });

        //determine duration in milliseconds
        var tmp = duration.split('d'); //split on any 'd's in the string
        var d = (isNaN(tmp[0]*1)?0:tmp[0]);
        tmp = tmp.toString().split('h');
        var h = (isNaN(tmp[0])?0:tmp[0]);
        tmp = tmp.toString().split('m');
        var m = (isNaN(tmp[0])?0:tmp[0]);
        tmp = tmp.toString().split('s');
        var s = (isNaN(tmp[0])?0:tmp[0]);

        var time_ms = (d*86400000) + (h*3600000) + (m*60000) + (s*1000);
        //set up filter for reactions
        const filter = (emoji, user) => 1 == 1;//options.includes(emoji);

        //debug logging
        bot.logger.debug(`question was "${question}"`);
        bot.logger.debug(`duration was "${duration}"`);
        bot.logger.debug(`options were "${options}"`);
        bot.logger.debug(`${d}d ${h}h ${m}m ${s}s`);
        bot.logger.debug(`time_ms was ${time_ms}`);

        if(time_ms == 0){
            message.reply("I can't poll something for 0ms!");

        }else if(options.length < 2){
            message.reply("You need more than one option, pal");
        }else{

            message.channel.send(`${question}?`)
                .then(msg => {
                    bot.logger.debug(`Foreach start`);
                    options.forEach(element => {
                        bot.logger.debug('getting element');
                        bot.logger.debug(`${element}`);
                        msg.react(element);
                    });
                    bot.logger.debug(`Foreach end`);
                    bot.logger.info('Starting poll');
                    msg.awaitReactions(filter, {time:time_ms}) //await reactions for specified time
                        .then(collected =>{
                            var winner = {count:0,emoji:''};
                            collected.forEach(element => {     //Check for the reaction with the highest count
                                if(element.count > winner.count){
                                    winner.count = element.count;
                                    winner.emoji = element.emoji;
                                }
                            });
                            bot.logger.info('Ending poll');
                            message.channel.send(`Looks like ${winner.emoji} wins!`);
                        })
                        .catch(bot.logger.error);
                })
                .catch(bot.logger.error);
        }
    },


}
