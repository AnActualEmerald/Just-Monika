module.exports = {
    name: "nom",
    description: "Eats whatever you want, or a burrito by default",
    args: false,
    cooldown: 1500,
    usage: "| <thing>",
    category: "Fun",
    execute(msg, args, bot) {
        if (args.length != 0) {
            //check if there are args
            var thing = args.join(" ");
            var numberE = bot.globalVar[`${thing}sEaten`];
            var plur = "";
            if (!numberE) {
                bot.globalVar[`${thing}sEaten`] = numberE = 1;
            } //add the thing to the JSON if it's not there already
            else {
                bot.globalVar[`${thing}sEaten`] = numberE += 1; //increment
            }

            if (numberE > 1) {
                plur = "s";
            } //Is it plural or not
            msg.channel
                .send(
                    `OM NOM NOM tasty '${thing}'. I've eaten ${numberE} '${thing}'${plur}`
                )
                .catch(bot.logger.error);
            return;
        }
        var thing = args.toString().replace(/,/g, " ");
        bot.globalVar.burritosEaten = bot.globalVar.burritosEaten + 1;
        msg.channel
            .send(
                "OM NOM NOM tasty burrito. I've eaten " +
                    bot.globalVar.burritosEaten +
                    " burritos"
            )
            .catch(bot.logger.error);
    }
};
