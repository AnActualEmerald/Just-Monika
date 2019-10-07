module.exports = {
    name:'uwu',
    alias:[],
    descritpion:'Translates text into uwu UwU',
    admin:false,
    args:true,
    usage:'<text>',
    cooldown:500,
    category:'fun',
    execute(message, args, bot){
        var t = args.toString().replace(/,/g, ' ');
        var res = t.replace('l', 'w').replace('r', 'w');
        message.channel.send(res);
    },
};