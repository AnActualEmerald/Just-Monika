var Discord = require("discord.js");
var fs = require("fs");
var Winston = require("winston");

//file locations
const guildFile = "./guilds.json";
const configFile = "./config.json";
const usersFile = "./users.json";
const varFile = "./commands/cmdVars.json";
const sayingsFile = "./commands.json";
const ccFile = "./commands/customCommands.json";
const starFile = "./starboard.json";

var config = require(configFile);
var ccF = require(ccFile);

//logging format
const myFormat = Winston.format.printf(
    ({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    }
);

//other variables
var starredMsgs = require(starFile);

//create bot
var bot = new Discord.Client();

//bot methods
bot.JSONtoCollection = JSONtoCollection;
bot.updateJSON = updateJSON;
bot.loadCmds = loadCmds;

//initialize bot
bot.myGuilds = require(guildFile);
bot.commands = new Discord.Collection();
bot.coolDowns = new Discord.Collection();
bot.customComs = JSONtoCollection(require(ccFile));
bot.globalVar = require(varFile);
bot.userVars = require(usersFile);
bot.prefix = config.prefix;
bot.auth = config.token;
bot.gr_key = config.goodreads_key;
bot.gr_secret = config.goodreads_secret;
bot.sayings = require(sayingsFile);
bot.ccFile = ccFile;

//set up logging
bot.logger = Winston.createLogger({
    level: config.winston_lvl,
    format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.prettyPrint(),
        Winston.format.label({ label: "logging" }),
        myFormat
    ),
    transports: [
        new Winston.transports.Console(),
        new Winston.transports.File({ filename: "info.log" }),
        new Winston.transports.File({
            filename: "debug_garbage.log",
            level: "silly"
        })
    ]
});

var netLog = Winston.createLogger({
    format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.prettyPrint(),
        Winston.format.label({ label: "network" }),
        myFormat
    ),
    transports: [new Winston.transports.File({ filename: "network.log" })]
});

//a little snippet taken from stack exchange (thanks Mateusz Moska)
String.prototype.interpolate = function(params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
};

bot.on("ready", () => {
    loadCmds();

    bot.logger.info("Bot start");

    bot.user.setActivity(bot.globalVar.activity);
});

//emojis
var thumbsdown = "👎";
//end emojis

bot.on("guildMemberAdd", member => {
    const guildName = member.guild.id;
    const channelName = bot.myGuilds[guildName].welcomeChannel;
    const welcomeMsg = bot.myGuilds[guildName].welcomeMessage;
    var channel;

    try {
        bot.logger.debug(`guildMemberAdd: cn ${channelName} wm ${welcomeMsg}`);
        channel = member.guild.channels.find("name", channelName);
    } catch (err) {
        bot.logger.error(`Couldn't get channel ${channelName}`);
        bot.logger.error(err);
    }

    const result = welcomeMsg.interpolate({ user: member.user });

    if (channel) {
        channel.send(result);
    }
});

bot.on("guildCreate", guild => {
    bot.myGuilds[guild.id] = {
        name: guild.name,
        welcomeChannel: "general",
        welcomeMessage: "Welcome to the server, <@${user.id}>",
        ignore: []
    };
    updateJSON(guildFile, bot.myGuilds);
    guild.owner.send(
        `Hey there, I just joined your server, ${guild.name}! I'm a perhaps not so helpful bot to have around, but I do my best. Use ${bot.prefix}help to learn about my commands. For now,	I'm set to welcome new users in your #general channel if you have one. You can change this and the message I send using ${bot.prefix}welcomechannel and ${bot.prefix}welcomemsg. I look forward to memeing with you!`
    );
});

bot.on("guildUpdate", guild => {
    try {
        bot.myGuilds[guild.id].name = guild.name;
    } catch (err) {
        bot.logger.error(err);
    }
    updateJSON(guildFile, bot.myGuilds);
});

bot.on("message", message => {
    if (message.channel.type === "dm") {
        return handleDM(message);
    }

    if (!bot.userVars[message.author]) {
        bot.userVars[message.author] = 0;
    }

    bot.userVars[message.author] = parseInt(bot.userVars[message.author]) + 1;

    updateJSON(usersFile, bot.userVars);

    if (message.author.bot) return;

    //listen for commands starting with the prefix
    if (message.content.startsWith(bot.prefix)) {
        bot.logger.info("Command string: " + message.content);

        const args = message.content.slice(bot.prefix.length).split(/ +/);
        const cmdName = args.shift().toLowerCase();

        bot.logger.debug(args);

        const com =
            bot.commands.get(cmdName) ||
            bot.commands.find(cmd => cmd.alias && cmd.alias.includes(cmdName));

        if (bot.customComs.has(cmdName))
            return message.channel.send(bot.customComs.get(cmdName));
        if (!com) {
            return bot.logger.debug(`No command ${cmdName} found`);
        }
        if (com.cooldown) {
            if (bot.coolDowns.get(message.member.id) == com.name) {
                message.reply("You're doing that too much");
                return;
            } else {
                bot.coolDowns.set(message.member.id, com.name);
                setTimeout(function() {
                    bot.coolDowns.delete(message.member.id);
                }, com.cooldown);
            }
        }

        //check perms
        var perms = [true];
        if (com.perms) {
            perms = com.perms.map(val => {
                console.log(val);
                if (val === "OWNER") {
                    if (message.author.id != 198606745034031104) {
                        //change this if you cloned this bot
                        message.reply(
                            "You don't have permission to use this command"
                        );
                        return false;
                    } else return true;
                } else {
                    return message.member.hasPermission(val, false, true, true);
                }
            });
        }

        try {
            if (perms.includes(true)) {
                com.execute(message, args, bot);
            } else {
                message.reply("You don't have permission to use that command");
            }
        } catch (e) {
            bot.logger.error(e);
            if (config.debug)
                message.channel.send("Had trouble with that command");
        }
    }

    for (var s in bot.sayings) {
        var cont = message.content;
        if (!bot.sayings[s].sens) {
            cont = cont.toLowerCase();
        }
        if (!cont.startsWith(s)) continue;
        var trigger = cont.substring(0, s.length);
        bot.logger.silly(`trigger = ${trigger}`);
        var rest = cont.substring(s.length);
        bot.logger.silly(`rest = ${rest}`);
        if (trigger == s) {
            bot.logger.debug();
            if (rest) {
                if (rest.startsWith(" "))
                    message.channel.send(bot.sayings[s].text);
            } else {
                message.channel.send(bot.sayings[s].text);
            }
        }
    }

    updateJSON(varFile, bot.globalVar);
    updateJSON(sayingsFile, bot.sayings);
    updateJSON(guildFile, bot.myGuilds);
});

bot.on("disconnect", event => {
    bot.logger.error("Websocket disconnected, code: " + event.code);
    bot.logger.error(event.reason);
    //bot.destroy();
    //bot.login(config.token);
});

bot.on("resume", replayed => {
    //may not be necessary but I'm going to do this anyways
    bot.logger.warn("Resuming bot");
    bot.user.setActivity(bot.globalVar.activity);
});

//event emitter mostly from https://discordjs.guide/popular-topics/reactions.html#emitting-the-event-s-yourself
const events = { MESSAGE_REACTION_ADD: "messageReactionAdd" };
bot.on("raw", e => {
    bot.logger.silly(`Event detected: ${e}`);
    if (!events.hasOwnProperty(e.t)) return; //check to see if the even is MESSAGE_REACTION_ADD
    const data = e.d;
    bot.logger.silly(`Data = ${data}`);
    const user = bot.users.get(data.user_id);
    bot.logger.silly(`User = ${user}`);
    const channel = bot.channels.get(data.channel_id);
    bot.logger.silly(`Channel = ${channel}`);

    if (channel.messages.has(data.message_id)) return; //prevent double emission

    channel.fetchMessage(data.message_id).then(message => {
        const emojiKey = data.emoji.id
            ? `${data.emoji.name}:${data.emoji.id}`
            : data.emoji.name;

        const reaction = message.reactions.get(emojiKey);

        bot.emit(events[e.t], reaction, user);
    });
});

//starboard events
bot.on("messageReactionAdd", (reaction, user) => {
    bot.logger.debug(`Reaction detected on ${reaction.message.guild.name}`);

    var server = reaction.message.guild;
    if (!bot.myGuilds[server.id].starboard_chan) {
        bot.logger.warn(`Starboard is not set up for ${server.name}`);
        return;
    }

    var guildData = bot.myGuilds[server.id];
    if (guildData.ignore.includes(reaction.message.channel)) {
        //woops lol
    }

    if (
        reaction.count >= guildData.star_lvl &&
        reaction.emoji == guildData.star_emoji
    ) {
        //do starboard stuff
        var channel = server.channels.find(
            chan => chan.id === guildData.starboard_chan
        );
        bot.logger.debug(`Channel ${channel}`);
        var author = reaction.message.member;
        bot.logger.debug(`Author ${author}`);
        var text = reaction.message.content;
        bot.logger.debug(`text ${text}`);
        var embeds = reaction.message.embeds;
        bot.logger.debug(`embeds ${embeds}`);
        var time = reaction.message.createdTimestamp;
        bot.logger.debug(`time ${time}`);

        var result = new Discord.RichEmbed();

        result.setTimestamp(time);
        result.setColor(author.displayColor);
        result.setAuthor(author.displayName, author.user.avatarURL);
        result.setFooter(server.name);
        result.setDescription(text);
        result.setURL(reaction.message.url);

        var e = reaction.message.embeds[0];
        if (e) {
            bot.logger.debug(`Found an embed ${e}`);
            if (e.title) result.setTitle(e.title);

            if (e.thumbnail) result.setThumbnail(e.thumbnail.url);

            if (e.description)
                result.setDescription(text + "\n\n" + e.description);

            if (e.footer) result.setFooter(e.footer.text);

            if (e.author) result.setAuthor(e.author.name, e.author.icon);

            if (e.color) result.setColor(e.color);

            if (e.image) result.setImage(e.image.url);

            if (e.file) result.attachFile(e.file);

            if (e.files) result.attachFiles(e.files);

            if (e.url) result.setURL(e.url);
        }

        var att = reaction.message.attachments.first();
        if (att) {
            bot.logger.debug(`Found an attachment ${att}`);
            result.setImage(att.url);
        }

        if (starredMsgs[reaction.message.id]) {
            bot.logger.info(
                `Message was starred already: ${reaction.message.url}`
            );
            var id = starredMsgs[reaction.message.id].star_id;
            channel.messages
                .find(msg => msg.id === id)
                .edit(`${reaction.emoji} #${reaction.count}`, result);
            return;
        } else {
            channel
                .send(`${reaction.emoji} #${reaction.count}`, result)
                .then(msg => {
                    starredMsgs[reaction.message.id] = { star_id: msg.id };
                });
        }
    }

    //    bot.commands.get('reactrole').handle(reaction, user);

    updateJSON(starFile, starredMsgs);
});

//logging stuff
bot.on("debug", info => {
    netLog.info(info); //only logs to the network.log file
    bot.logger.verbose(info);
});

bot.on("warn", info => {
    bot.logger.warn(info);
});

bot.on("error", info => {
    bot.logger.error(info);
});

//functions

function updateJSON(fileName, data, cooked) {
    if (!cooked) {
        data = JSON.stringify(data);
    }

    fs.writeFile(fileName, data, function(err) {
        if (err) {
            bot.logger.error("Error saving to JSON file");
            bot.logger.error(fileName);
            bot.logger.error(err);
        }
    });
}

function loadCmds(message) {
    const commandFiles = fs
        .readdirSync("./commands")
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        try {
            delete require.cache[require.resolve(`./commands/${file}`)];
            const command = require(`./commands/${file}`);
            bot.commands.set(command.name, command);
        } catch (e) {
            bot.logger.error(e);
            if (message)
                message.channel.send(`There was an error with loading ${file}`);
        }
    }

    delete require.cache[require.resolve(ccFile)];
    ccF = require(ccFile);

    bot.customComs = bot.JSONtoCollection(ccF);
}

function handleDM(message) {
    //do something here
}

bot.collectionToJSON = function(collection) {
    var obj = {};
    var keys = collection.keyArray();

    for (var i = 0; i < keys.length; i++) {
        var val = collection.get(keys[i]);
        obj[keys[i]] = val;
    }

    bot.logger.debug("bot.collectionToJSON returned: " + obj);

    return obj;
};

function JSONtoCollection(obj) {
    var coll = new Discord.Collection();

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            coll.set(key, obj[key]);
        }
    }
    return coll;
}

bot.login(config.token);
