const Discord = require('discord.js');
const bot = new Discord.Client();

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
  if (message.content.startsWith('++play')) {
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
