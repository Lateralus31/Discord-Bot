const Discord = require('discord.js');
const TwitchApi = require('twitch-api');
const yt = require('ytdl-core');
const fs = require('fs');
const path = require('path');

//Variables
var bot = new Discord.Client();
// var twitch = new TwitchApi({
//   clientId: '9sp3dkzpma658nceye9vwehh0inja3',
//   clientSecret: '72ou1bzi23d9jvvw56opysc1r4h39a',
//   redirectUri: 'https://128.199.72.161',
//   scopes: 'user_follows_edit channel_check_subscription channel_commercial channel_editor channel_feed_edit channel_feed_read channel_read channel_stream channel_subscriptions chat_login user_blocks_edit user_blocks_read user_read user_subscriptions'
// });
var LOADDIR = 'audio/'
var PREFIX = '=='

//Delete any message in the channel that is a bot command after a delay
bot.on('message', (message) => {
  if(message.content.startsWith(PREFIX))
  {
    message.delete();
  }
});

//Reply in chat room back to specific message
bot.on('message', (message) => {
  if(message.content == (PREFIX + "jake"))
  {
    message.channel.sendMessage('is a pleb');
  }
});

//Reply in PM to specific message
bot.on('message', (message) => {
  if(message.content == (PREFIX + "zane"))
  {
    message.author.sendMessage("has a sick emoji!");
  }
});

//Return a list of audio files that can be played to the user
bot.on('message', message => {
  //check for correct command
  if(message.content == (PREFIX + "emotes"))
  {
    //using fs read the directory with the audio files in it
    var fileArray = fs.readdirSync(LOADDIR);
    //print out array to console for debug purposes
    console.log(fileArray);
    //Initialise files as a blank string
    var files = ''
    //loop through the fileArray
    for (var i=0; i<fileArray.length; i++)
    {
      //Slice the .mp3 off the ends of the files and create a new line
      var files = (fileArray[i].slice(0,-4))+'\n'+files;
    }

    //send a message to the current channel with an embed
    message.channel.sendMessage("", {embed: {
      color: 3447003,
    author: {
      name: bot.user.username,
      icon_url: bot.user.avatarURL
    },
    title: 'Just add "-=" before these phrases',
    //print out the files array in the embed message
    description:files,
    timestamp: new Date(),
    footer: {
      icon_url: bot.user.avatarURL,
      text: '© Lateralus31'
    }
    }});
  }
});

//Play an mp3 file located in the audio folder
bot.on('message', message => {
  if (message.content.startsWith('-=')) {
  //delete the message
  message.delete();
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
	  dispatcher.on('end', () => {
			voiceChannel.leave();
		});
    })
    .catch(console.error);
  }
});

//Stream a youtube videos audio
bot.on('message', message => {
  if (message.content.startsWith(PREFIX + 'youtube ')) {
    //split the message with spaces
    var ytLink = message.content.split('v=');
    //remove the rest of the link and message
    ytLink.splice(0,1);
    //Output the video ID to console for debug purposes
    console.log(ytLink);
    //check the voicechannel that the user is in
    const voiceChannel = message.member.voiceChannel;
    //If not in a voice channel send a warning
    if (!voiceChannel) {
      return message.reply(`Please be in a voice channel first!`);
    }
    //join the correct voice channel
    voiceChannel.join()
      .then(connnection => {
        let stream = yt("https://www.youtube.com/watch?v=" + ytLink, {audioonly: true});
        const dispatcher = connnection.playStream(stream);
        dispatcher.on('end', () => {
          voiceChannel.leave();
        });
      });
  }
});

bot.on('message', message => {
  //if starts with prefix & command + room
  if (message.content.startsWith(PREFIX + 'moveto ')) {
    //split room from message
    var voiceChannel = message.content.split(" ");
    //remove command from message
    voiceChannel.splice(0,1);
    var targetChannel = message.guild.channels.find(c => c.name === voiceChannel.toString() && c.type === 'voice');
    if (!targetChannel) {
      return message.reply(`This is not a valid voice channel`);
    }
    console.log(targetChannel);
    console.log(message.member.voiceChannel.id);
    var curretUsers = Array.from(message.member.voiceChannel.members.values());
    for(i=0; i<curretUsers.length; i++) {
      message.guild.members.find('id', curretUsers[i].user.id).setVoiceChannel(targetChannel.id);
    }
    //console.log(curretUsers);
    //curretUsers.forEach(setVoiceChannel(targetChannel.id));
    //user.join(voiceChannel);
    //move users to "room"
  }
})

// var code = POST https://api.twitch.tv/kraken/oauth2/token;
// //TWITCH API oauth:v8hxe2vxfx2t54q55w2mlcheaslcfo
// //https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=9sp3dkzpma658nceye9vwehh0inja3&redirect_uri=https://128.199.72.161&scope=user_follows_edit channel_check_subscription channel_commercial channel_editor channel_feed_edit channel_feed_read channel_read channel_stream channel_subscriptions chat_login user_blocks_edit user_blocks_read user_read user_subscriptions&state=72ou1bzi23d9jvvw56opysc1r4h39a
//   twitch.getAccessToken(code, function(err, body){
//     if(err){
//       console.log(err);
//     } else {
//       twitch.getUserFollowsChannel(Lateralus31, nautfoxx, console.log())
//     }
//   });

//Log the bot in to the server
bot.login('MjYxMjk4MzI4MTAzMjg4ODMy.Czy4kg.u9aqQK_jQKe8Gnr6jhfPuPG7o0I');

//Set the bots current game
bot.on('ready', () => {
  bot.user.setGame('Being Broken');
});

//catch any errors from promises
process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});
