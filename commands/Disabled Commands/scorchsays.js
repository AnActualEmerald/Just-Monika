const jimp = require('jimp');
const orgFile = './commands/res/scorch.jpg';
var orgImage;
var smallF;
var middleF;
var largeF;

Promise.all([jimp.read(orgFile),
			jimp.loadFont(jimp.FONT_SANS_16_WHITE),
			jimp.loadFont(jimp.FONT_SANS_32_WHITE),
			jimp.loadFont(jimp.FONT_SANS_64_WHITE)])
			.then((values) => {
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
		
		//x450 y475
		var loadedImg;
		var caption = args.toString().replace(/,/g, ' ');
		var editedFile = './commands/res/ScorchTmp.jpg'
		var font;
		if(caption.length * 20 >= 1200)
		{
			font = smallF;
			console.log("len s: " + caption.length * 20);
		}else if(caption.length * 20 <= 300)
		{
			font = largeF;
			console.log("len l: " + caption.length * 20);
		}else{
			font = middleF;
			console.log("len m: " + caption.length * 20);
		}
		 
		jimp.read('./commands/res/scorch.jpg')
			.then(function(image){
				loadedImg = image;
				//try{
					loadedImg.print(font, 
					40, 
					135, 
					caption,
					300).write(editedFile);
				
					message.channel.send({files:[editedFile]});
					delete loadedImage;
					console.log("sent the image");
			})
				.catch((err) => {
					console.error(err);
					message.channel.send("Couldn't process the image, check the logs");
				});
		
		
	},
};
