const Discord = require('discord.js');
const yt = require('ytdl-core');
const bot = new Discord.Client();

//Variables
var LOADDIR = "audio/"

//Reply in chat room back to specific message
bot.on('message', (message) => {
  if(message.content == "jake")
  {
    message.channel.sendMessage('is gay');
  }
});

//Reply in PM to specific message
bot.on('message', (message) => {
  if(message.content == "zane")
  {
    message.author.sendMessage("has a sick emoji!");
  }
});

bot.on('message', message => {
  if (message.content.startsWith('-')) {
	//split the message with spaces
	var audioFile = message.content.split("=");
	//remove the prefix
	audioFile.splice(0, 1);
	//then join the audioFile with spaces
	//which returns the original message without the prefix
	audioFile = audioFile.join("=");
	//join the directory and filename to load from
	var filePath = LOADDIR + audioFile + ".mp3"
	//output filename and path to console
	console.log(filePath);
	
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      return message.reply(`Please be in a voice channel first!`);
    }
    voiceChannel.join()
    .then(connection => {
      return connection.playFile(filePath);
     })
    .then(dispatcher => {
      dispatcher.on('error', console.error);
    })
    .catch(console.error);
  }
});

bot.on('message', message => {
  if (message.content.startsWith('++youtube')) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      return message.reply(`Please be in a voice channel first!`);
    }
    voiceChannel.join()
      .then(connnection => {
        let stream = yt("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {audioonly: true});
        const dispatcher = connnection.playStream(stream);
        dispatcher.on('end', () => {
          voiceChannel.leave();
        });
      });
  }
});

bot.login('MjYxMjk4MzI4MTAzMjg4ODMy.Czy4kg.u9aqQK_jQKe8Gnr6jhfPuPG7o0I');
