const jimp = require('jimp');
const orgFile = './commands/res/scorch.jpg';
const FNT_16 = './commands/res/QAFNT_16.fnt';
const FNT_32 = './commands/res/QAFNT_32.fnt';
const FNT_64 = './commands/res/QAFNT_64.fnt'; // These fonts aren't actually these sizes
var orgImage;
var smallF;
var middleF;
var largeF;
var defX = 0;
var defY = 150;


Promise.all([jimp.read(orgFile),
			jimp.loadFont(FNT_16),//jimp.FONT_SANS_16_BLACK),
			jimp.loadFont(FNT_32),//jimp.FONT_SANS_32_BLACK),
			jimp.loadFont(FNT_64)])//jimp.FONT_SANS_64_BLACK)])
			.then((values) => {
				console.log('This code ran');
				orgImage = values[0];
				smallF = values[1];
				middleF = values[2];
				largeF = values[3];
				
			})
			.catch((err) => {
				console.log("There was a problem loading the fonts");
				console.error(err);
			});

module.exports = {
	name:'monika',
	alias: '',
	description:'sends an image of whatever Monika says',
	args:true,
	usage:'<text>',
	cooldown:1500,
	execute(message, args, bot){
		message.channel.startTyping();
		//x450 y475
		var loadedImg;
		var caption = args.toString().replace(/,/g, ' ');
		var editedFile = './commands/res/ScorchTmp.jpg'
		var font;
		if(bot.config.debug) console.log(caption);
		var len = jimp.measureText(middleF, caption);
		if(len >= 1200)
		{
			font = smallF;
			console.log("len s: " + len);
		}else if(len <= 400)
		{
			font = largeF;
			console.log("len l: " + len);
		}else{
			font = middleF;
			console.log("len m: " + len);
		}
		 
		jimp.read('./commands/res/scorch.jpg')
			.then(function(image){
				loadedImg = image;
				//try{
					loadedImg.print(font, 
					defX, 
					defY,
					{ 
						text:caption,
						alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
						alignmentY: jimp.VERTICAL_ALIGN_TOP
					},
					300).write(editedFile);
				
					message.channel.stopTyping(true);
					message.channel.send({files:[editedFile]});
					delete loadedImage;
					console.log("sent the image");
			})
				.catch((err) => {
					console.error(err);
					message.channel.send("Couldn't process the image, check the logs");
					messag.channel.stopTyping(true);
				});
		
		message.channel.stopTyping(true);
	},
};
