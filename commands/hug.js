const fs = require("fs");
const https = require("https");

module.exports = {
    name: "hug",
    alias: ["h"],
    args: true,
    description: "Send a hug to a friend",
    usage: "<user>",
    category: "Fun",
    execute(message, args, bot) {
        let target = message.mentions.members.first();
        /*      if (args.shift() === "add") {
            try {
                let gif = message.attachments.first();
                if (gif) {
                    addGif(message, gif, bot);
                } else {
                    addGifURL(message, args.shift(), bot);
                }
            } catch (e) {
                bot.logger.error(e);
                message.reply("couldn't add gif");
            }
            return;
        }
 */
        if (!target) {
            message.reply("you have to hug somebody!");
            return;
        }

        let h = Number(args.pop());
        //bot.logger.log(`H: ${h}`);
        let id = h > 0 ? h : Math.floor(Math.random() * bot.hugs) + 1;
        message.channel
            .send({ files: [`./commands/data/hugs/${id}.gif`] })
            .catch(bot.logger.error);
    }
};

function addGif(message, gif, bot) {
    if (!gif.filename.endsWith(".gif")) {
        message.reply("I only hug with gifs");
        return;
    }

    let file = "";

    fs.readFile(gif.url, (err, data) => {
        file = data;
    });

    /* https.get(gif.url, res => {
        res.on("data", d => {
            parseString(d, (err, result) => {
                file = result;
            });
        });
    }); */

    let count = 0;

    fs.readdir("./commands/data/hugs", (err, files) => {
        count = files.length;
    });

    fs.writeFile(`./commands/data/hugs/${count + 1}.gif`, file, err => {
        if (err) throw err;
        bot.logger.info("Finished writing hug file");
    });
}

function addGifURL(message, gif, bot) {
    let file = "";

    /*    fs.readFile(gif, (err, data) => {
        if (err) throw err;
        bot.logger.debug(`Got response from gif url: ${data}`);
        file = data;
    });
 */
    try {
        https.get(gif, res => {
            res.on("data", d => {
                bot.logger.debug(`Got response from gif url: ${d}`);
                file = d;

                let count = 1;

                fs.readdir("./commands/data/hugs", (err, files) => {
                    count = files.length + 1;
                });

                fs.writeFile(`./commands/data/hugs/${count}.gif`, file, err => {
                    if (err) throw err;
                    bot.logger.info("Finished writing hug file");
                    message.reply(`hug ${count} added`);
                });
            });
        });
    } catch (e) {
        bot.logger.error(e);
    }
}
