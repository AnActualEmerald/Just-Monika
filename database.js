const MongoClient = require("mongodb").MongoClient;
const Long = require("bson").Long;
const url = "mongodb://localhost:27017";

const dbName = "settings";

let connection;
let database;
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Connected to DB OK");
        module.exports.ready = true;
    }
    connection = client;
    database = client.db(dbName);
});

const addGuild = (guild, logger) => {
    //get the guilds collection out of the database
    let guilds = database.collection("guilds");

    guilds.insertOne(
        {
            id: guild.id,
            name: guild.name,
            prefix: "!",
            welcomeChannel: "general",
            welcomeMessage: "Welcome to the server, <@${user.id}>",
            ignore: [],
        },
        (err, res) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(`Inserted one doc to collection 'guilds'`);
                return false;
            }
        }
    );
    return true;
};

const updateGuild = (guild, logger) => {
    //get the guilds collection out of the database
    let guilds = database.collection("guilds");

    guilds.updateOne(
        { id: guild.id },
        { $set: { name: guild.name } },
        (err, res) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(`Updated guild ${id}'s name to ${guild.name}`);
                result = true;
            }
        }
    );
};

const getGuildProp = async (guild_id, prop, logger) => {
    let guilds = database.collection("guilds");

    return await guilds.findOne({ id: guild_id }).then((doc) => {
        return doc[prop];
    });
};

const setGuildProp = (guild_id, prop, value, logger) => {
    let guilds = database.collection("guilds");

    guilds.updateOne(
        { id: guild_id },

        { $set: { [prop]: value } },
        (err, res) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(`Updated guild ${guild_id}'s ${prop} to ${value}`);
                result = true;
            }
        }
    );
};

const setGuildArrayProp = (guild_id, prop, value, logger) => {
    let guilds = database.collection("guilds");

    guilds.updateOne(
        { id: guild_id },

        { $push: { [prop]: value } },
        (err, res) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(`Updated guild ${guild_id}'s ${prop} to ${value}`);
                result = true;
            }
        }
    );
};

//this doesn't work
const removeGuildArrayProp = (guild_id, prop, val, logger) => {
    let guilds = database.collection("guilds");

    guilds.updateOne({ id: guild_id }, { $pull: { [prop]: val } });
};

const removeGuild = (guild_id, logger) => {
    let guilds = database.collection("guilds");

    guilds.deleteOne({ id: guild_id });
};

module.exports = {
    ready: false,
    addGuild: addGuild,
    updateGuild: updateGuild,
    getGuildProp: getGuildProp,
    setGuildProp: setGuildProp,
    removeGuildArrayProp: removeGuildArrayProp,
    setGuildArrayProp: setGuildArrayProp,
    removeGuild: removeGuild,
};
