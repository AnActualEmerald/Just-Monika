var Discord = require("discord.js");
var fs = require("fs");
var Winston = require("winston");
var util = require(`util`);

//file locations
const guildFile = "./guilds.json";
const configFile = "./config.json";
const usersFile = "./users.json";
const varFile = "./commands/cmdVars.json";
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
var today = new Date();

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
bot.auth = config.token;
bot.gr_key = config.goodreads_key;
bot.gr_secret = config.goodreads_secret;
bot.ccFile = ccFile;
bot.events = {};
bot.starredMsgs = require(starFile);
bot.hugs = 0;

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
        new Winston.transports.File({
            filename: `info${today.getMonth()}-${today.getDate()}.log`
        }),
        new Winston.transports.File({
            filename: `debug_garbage${today.getMonth()}-${today.getDate()}.log`,
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
    transports: [
        new Winston.transports.File({
            filename: `network${today.getMonth()}-${today.getDate()}.log`
        })
    ]
});

//a little snippet taken from stack exchange (thanks Mateusz Moska)
String.prototype.interpolate = function(params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
};

bot.on("ready", () => {
    loadCmds();

    fs.readdir("./commands/data/hugs", (err, files) => {
        bot.hugs = files.length;
    });

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
        prefix: "!",
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

    let guild = message.member.guild.id;

    if (message.author.bot) return;

    let prefix = bot.myGuilds[guild].prefix;
    //listen for commands starting with the prefix
    if (message.content.startsWith(prefix)) {
        bot.logger.info("Command string: " + message.content);

        let args = message.content.slice(prefix.length).split(/ +/);
        let cmdName = args.shift().toLowerCase();

        bot.logger.debug(args);

        const com =
            bot.commands.get(cmdName) ||
            bot.commands.find(cmd => cmd.alias && cmd.alias.includes(cmdName));

        let exe = com;

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

        //check to see if we should be running a subcommand
        if (com.subcommands) {
            if (com.subcommands[args[0]]) {
                exe = com.subcommands[args.shift()];
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
                exe.execute(message, args, bot);
            } else {
                message.reply("You don't have permission to use that command");
            }
        } catch (e) {
            bot.logger.error(e);
            if (config.debug)
                message.channel.send("Had trouble with that command");
        }
    }

    if (!bot.userVars[message.author]) {
        bot.userVars[message.author] = 0;
    }

    bot.userVars[message.author] = parseInt(bot.userVars[message.author]) + 1;

    updateJSON(usersFile, bot.userVars);

    updateJSON(varFile, bot.globalVar);
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
const events = {
    MESSAGE_REACTION_ADD: "messageReactionAdd",
    MESSAGE_DELETE: "messageDelete"
};
bot.on("raw", (e, m) => {
    bot.logger.silly(`Event detected: ${util.inspect(e)}`);
    bot.logger.silly(`Anything?: ${util.inspect(m)}`);
    if (!events.hasOwnProperty(e.t)) return; //check to see if the event is MESSAGE_REACTION_ADD
    const data = e.d;
    bot.logger.silly(`Data = ${util.inspect(data)}`);
    const user = bot.users.get(data.user_id);
    bot.logger.silly(`User = ${util.inspect(user)}`);
    const channel = bot.channels.get(data.channel_id);
    bot.logger.silly(`Channel = ${util.inspect(channel)}`);

    if (channel.messages.has(data.message_id)) return; //prevent double emission
    /* 
    switch (e.t) {
        case events.MESSAGE_DELETE: {
            channel.fetchMessage(data.id).then(msg => {
                bot.emit(events[e.t], msg);
            });
        }
        case events.MESSAGE_REACTION_ADD: {
            channel.fetchMessage(data.message_id).then(message => {
                const emojiKey = data.emoji.id
                    ? `${data.emoji.name}:${data.emoji.id}`
                    : data.emoji.name;

                const reaction = message.reactions.get(emojiKey);

                bot.emit(events[e.t], reaction, user);
            });
        }
    } */

    channel.fetchMessage(data.message_id || data.id).then(message => {
        /*  switch (e.t) {
            case events.MESSAGE_DELETE: {
                bot.emit(events[e.t], message);
            }
            case events.MESSAGE_REACTION_ADD: { */
        const emojiKey = data.emoji.id
            ? `${data.emoji.name}:${data.emoji.id}`
            : data.emoji.name;

        const reaction = message.reactions.get(emojiKey);

        bot.emit(events[e.t], reaction, user);
        // }
        //}
    });
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

//moderation stuff
bot.on("messageDelete", message => {
    try {
        bot.events["messageDelete"].forEach(e => e(message));
    } catch (e) {
        bot.logger.error("Error in messageDelete");
        bot.logger.error(e);
    }
});

bot.on("messageUpdate", (oldM, newM) => {
    try {
        bot.events["messageUpdate"].forEach(e => e(oldM, newM));
    } catch (e) {
        bot.logger.error("Error in messageUpdate");
        bot.logger.error(e);
    }
});

bot.on("guildBanAdd", (guild, user) => {
    try {
        bot.events["guildBanAdd"].forEach(e => e(guild, user));
    } catch (e) {
        bot.logger.error("Error in guildBanAdd");
        bot.logger.error(e);
    }
});

//starboard
bot.on("messageReactionAdd", (reaction, user) => {
    try {
        bot.events["messageReactionAdd"].forEach(e => e(reaction, user));
    } catch (e) {
        bot.logger.error("Error in messageReactionAdd");
        bot.logger.error(e);
    }
});

bot.on("messageReactionRemove", (reaction, user) => {
    try {
        bot.events["messageReactionRemove"].forEach(e => e(reaction, user));
    } catch (e) {
        bot.logger.error("Error in messageReactionRemove");
        bot.logger.error(e);
    }
});

//functions

function updateJSON(fileName, data, cooked) {
    bot.logger.debug(`Saving JSON to ${fileName}`);

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
    bot.events = {};

    const commandFiles = fs
        .readdirSync("./commands")
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        try {
            delete require.cache[require.resolve(`./commands/${file}`)];
            const command = require(`./commands/${file}`);
            if (command.load) command.load();
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

bot.updateJSON = updateJSON;

bot.addEventListener = (event, func) => {
    if (bot.events[event]) {
        bot.events[event].push(func);
        bot.logger.info(`Created listener for ${event}`);
    } else {
        bot.events[event] = [func];
        bot.logger.info(`Added listener for ${event}`);
    }
};

//export the bot so other files can use it
module.exports = bot;
