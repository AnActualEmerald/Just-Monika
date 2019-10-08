const uwuOptions = ['UwU', 'Uwu', 'uwU', 'ÚwÚ', 'uwu', '☆w☆', '✧w✧', '♥w♥', '︠uw ︠u', '(uwu)', 'OwO', 'owo', 'Owo', 'owO'];

module.exports = {
    name:'uwu',
    alias:[],
    description:'Translates text into uwu UwU',
    admin:false,
    args:true,
    usage:'<text>',
    cooldown:500,
    category:'fun',
    execute(message, args, bot){
        var t = args.toString().replace(/,/g, ' ');
        var res = t.replace(/l/g, 'w').replace(/r/g, 'w').replace(/th/g, 'd');
        res = res + " " + uwuOptions[Math.floor(Math.random() * (uwuOptions.length - 1))]
        message.channel.send(res);
    },
};