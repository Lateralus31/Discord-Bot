const Discord = require('discord.js');
const TwitchApi = require('twitch-api');
const yt = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const http = require('http');
const https = require('https');
const config = require('./config.json')

//Variables
var bot = new Discord.Client();
var parser = new xml2js.Parser();
var LOADDIR = 'audio/'
var PREFIX = '=='

//Delete any message in the channel that is a bot command after a delay
bot.on('message', (message) =>
{
  if(message.content.startsWith(PREFIX))
  {
    message.delete();
  }
});

//Reply in chat room back to specific message
bot.on('message', (message) =>
{
  if(message.content == (PREFIX + "reply"))
  {
    message.channel.sendMessage('here is a reply');
  }
});

//Reply in PM to specific message
bot.on('message', (message) =>
{
  if(message.content == (PREFIX + "pm"))
  {
    message.author.sendMessage("here is a personal message");
  }
});

//Return a list of audio files that can be played to the user
bot.on('message', message =>
{
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
    message.channel.send("", {embed: {
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
bot.on('message', message =>
{
  if (message.content.startsWith('-='))
  {
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
    //get the voice channel of the author
    const voiceChannel = message.member.voiceChannel;
    //if there is no voice channel send user a warning
    if (!voiceChannel)
    {
      return message.reply(`Please be in a voice channel first!`);
    }
    //join the voice channel
    voiceChannel.join()
	  .then(connection =>
    {
      //play the file specified
      return connection.playFile(filePath);
    })
    .then(dispatcher =>
    {
      //catch any errors
      dispatcher.on('error', console.error);
	    dispatcher.on('end', () =>
      {
			  voiceChannel.leave();
		  });
    })
    //log errors to console
    .catch(console.error);
  }
});

//Stream a youtube videos audio
bot.on('message', message =>
{
  if (message.content.startsWith(PREFIX + 'youtube '))
  {
    //split the message with spaces
    var ytLink = message.content.split('v=');
    //remove the rest of the link and message
    ytLink.splice(0,1);
    //Output the video ID to console for debug purposes
    console.log(ytLink);
    //check the voicechannel that the user is in
    const voiceChannel = message.member.voiceChannel;
    //If not in a voice channel send a warning
    if (!voiceChannel)
    {
      return message.reply(`Please be in a voice channel first!`);
    }
    //join the correct voice channel
    voiceChannel.join()
    .then(connnection =>
    {
      //stream the link user specified
      let stream = yt("https://www.youtube.com/watch?v=" + ytLink, {audioonly: true});
      const dispatcher = connnection.playStream(stream);
      //when the stream ends leave the voice channel
      dispatcher.on('end', () =>
      {
        voiceChannel.leave();
      });
    });
  }
});

//Move all users in current voice channel to new one
bot.on('message', message =>
{
  //if starts with prefix & command + room
  if (message.content.startsWith(PREFIX + 'moveto '))
  {
    //split room and command into array
    var voiceChannel = message.content.split(/ (.+)/,[2]);
    //remove the command from the array
    voiceChannel.splice(0,1);
    //send channel to console for debug purposes
    console.log(voiceChannel);
    //find voice channels by name which match voice channel user input
    var targetChannel = message.guild.channels.find(c => c.name === voiceChannel.toString() && c.type === 'voice');
    if (!targetChannel)
    {
      //if channel doesn't exist return an error to user
      return message.reply(`This is not a valid voice channel`);
    }
    //send channel ID to console for debug purposes
    console.log(message.member.voiceChannel.id);
    //put current users in channel into an array
    var curretUsers = Array.from(message.member.voiceChannel.members.values());
    for(i=0; i<curretUsers.length; i++)
    {
      //set these users voice channel to the one input from command
      message.guild.members.find('id', curretUsers[i].user.id).setVoiceChannel(targetChannel.id);
    }
  }
});

function getSteamID32(callback)
{
  parser.on('error', function(err) { console.log('Parser error', err); });
  //HTTP request to Steam to get profile information
  http.get('http://steamcommunity.com/id/ReversaL31?xml=1', function(res)
  {
    //if code is successful
     if (res.statusCode >= 200 && res.statusCode < 400)
     {
       var data = '';
       //convert data to string
       res.on('data', function(data_) { data += data_.toString(); });
       //when the request ends
       res.on('end', function()
       {
         //run XML through parser to convert to JSON
         parser.parseString(data, function(err, result)
         {
           //Initialise steam ID convertor to change from 64 to 32 bit ID
           var convertor = require('steam-id-convertor');
           var steamID64 = '';
           var steamID32 = '';
           //convert the ID
           steamID64 = result.profile.steamID64.toString();
           steamID32 = convertor.to32(steamID64);
           //log IDs to console for debug purposes
           console.log('success');
           console.log('Steam64 ID: ', steamID64);
           console.log('Steam32 ID: ', steamID32);
           //return the ID
           callback(steamID32);
        });
      });
    };
  });
}

bot.on('message', message =>
{
  if (message.content.startsWith(PREFIX + 'id'))
  {
    getSteamID32(function(response)
    {
      message.reply('done');
      console.log('this is working', response);
    })
  }
});
  /*https.get('https://api.opendota.com/api/players/' + steamID32, function(resu)
  {
     if (resu.statusCode >= 200 && res.statusCode < 400)
     {
       console.log('success');
       resu.on('playerResult', function(data_) { data += data_.toString(); });
       resu.on('end', function()
       {
         parser.parseString(playerResult, function(err, parsedResult)
         {
           console.log(parsedResult);
         });
       });
     }
   });*/

//Log the bot in to the server
bot.login(config.token);

//Set the bots current game
bot.on('ready', () => {
  bot.user.setGame('Being Broken');
});

//catch any errors from promises
process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});
