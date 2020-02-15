const goodreads = require("goodreads-api-node");
const util = require("util");
const https = require("https");
const Discord = require("discord.js");

var parseString = require("xml2js").parseString;

module.exports = {
    name: "authorsearch",
    alias: ["author"],
    args: true,
    description: "Searches www.goodreads.com for a book by title",
    cooldown: 1500,
    usage: "<title>",
    category: "Utilities",
    execute(message, args, bot) {
        const credentials = { key: bot.gr_key, secret: bot.gr_secret };
        //const gr_client = goodreads(credentials);

        var q_string = args.join(" ");

        if (!bot.globalVar.rate_ok) {
            bot.logger.warn("goodreads rate limit");
            message.reply("I'm a little busy right now, try again in a bit");
            return;
        }

        var request = `https://www.goodreads.com/api/author_url/${q_string}?key=${bot.gr_key}`;

        bot.logger.info(`Sending goodreads request`);
        bot.globalVar.rate_ok = false;
        setTimeout(function() {
            bot.globalVar.rate_ok = true;
            bot.logger.info("reset goodreads ratelimit");
        }, 1200);
        https.get(request, rec => {
            bot.logger.silly(util.inspect(rec, false, null));
            var resString = "";
            rec.on("data", d => {
                bot.logger.info(`Got result from Goodreads`);
                bot.logger.debug(d);

                parseString(d, (err, result) => {
                    var obj = result;
                    bot.logger.debug(util.inspect(result, false, null));
                    try {
                        message.channel
                            .send(obj.GoodreadsResponse.author[0].link)
                            .catch(bot.logger.error);
                    } catch (e) {
                        bot.logger.error(e);
                        message.channel.send(`Author not found`);
                    }
                });
            });
        });
    }
};
