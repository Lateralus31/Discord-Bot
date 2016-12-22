const Discord = require('discord.js');
const bot = new Discord.Client();

//Reply in chat room back to specific message
bot.on('message', (message) =>
{
  if(message.content == "jake")
  {
    message.channel.sendMessage('is gay');
  }
});

//Reply in PM to specific message
bot.on('message', (message) =>
{
  if(message.content == "zane")
  {
    message.author.sendMessage("has a sick emoji!");
  }
});

bot.login('MjYxMjk4MzI4MTAzMjg4ODMy.Czy4kg.u9aqQK_jQKe8Gnr6jhfPuPG7o0I');
