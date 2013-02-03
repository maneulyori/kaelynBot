Number.prototype.zeroPad = Number.prototype.zeroPad || 
     function(base){
       var nr = this, len = (String(base).length - String(nr).length)+1;
       return len > 0? new Array(len).join('0')+nr : nr;
    };

var fs = require('fs');

var client;
var channelHT = new Object();
var channelLogStream = new Object();

exports.init = init;
exports.messageHandler = messageHandler;

var channelBlacklist = ["#!_bin_bash"];

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: { command: ["로깅"] }, callBack: messageHandler, rawPromiscCallBack: promiscMessageHandler, unloadCallback: unload };
}

function getTimestamp(date)
{
	var timestamp = date.getFullYear().zeroPad(1000) + '-' + (date.getMonth()+1).zeroPad(10) + '-' + date.getDate().zeroPad(10) + ' ' + date.getHours().zeroPad(10) + ':' + date.getMinutes().zeroPad(10) + ':' + date.getSeconds().zeroPad(10);

	return timestamp;
}

function openLogStream(channel)
{
	var date = new Date();
	var timestamp =  date.getFullYear().zeroPad(1000) + '-' + (date.getMonth()+1).zeroPad(10) + '-' + date.getDate().zeroPad(10);

	fs.createWriteStream("logs/" + channel + "-" + timestamp + ".log", { flags: "a", encoding: "UTF-8", mode: 0666});
	channelLogStream[channel].write("Start logging at " + date  + "\n");
}

function closeLogStream(channel)
{
	console.log("Closing log stream: " + channel + "\n");
	channelLogStream[channel].end("Logging ends at " + new Date() + "\n", "UTF-8");

	delete channelLogStream[channel];
}

function writeLog(channel, message)
{
	var date = new Date();
	var timestamp = getTimestamp(date);

	channel = channel.replace(/\//g, "_");
	if(channelLogStream[channel] == undefined)
	{
		openLogStream(channel);
	}
	channelLogStream[channel].write(timestamp + " " + message + "\r\n", "UTF-8");
}

function messageHandler(message)
{
	var date = new Date();
	var timestamp = getTimestamp(date);

	for (var black in channelBlacklist)
	{
		if(message.channel == black)
			return ;
	}

	if(message.command == "PRIVMSG")
	{
		if(message.splitedMessage[0] == "로깅")
		{
			client.privmsg(message.channel, "E: permission denied.");
			/*
			if(channelHT[message.channel] == undefined)
			{
				channelHT[message.channel] = true;
			}
			else
			{
				channelHT[message.channel] = !channelHT[message.channel];
			}*/
		}
	}
}

function promiscMessageHandler(message)
{
	if(message.command == "PRIVMSG")
	{
		writeLog(message.channel, '<' + message.nick + '> ' + message.content);
	}
	else if(message.command == "KICK")
	{
		writeLog(message.channel, message.nick + " kicks " + message.args[1] + " (" + message.args[2] + ")");
	}
	else if(message.command == "JOIN")
	{
		writeLog(message.channel, message.prefix + " Joins.");
	}
	else if(message.command == "PART")
	{
		writeLog(message.channel, message.prefix + " Parts. (" + message.args[1] + ")");
	}
	else if(message.command == 'MODE')
	{
		modeStr = '';

		for(this.i = 1; this.i <message.args.length; this.i++)
			modeStr += message.args[this.i] + ' ';

		writeLog(message.channel, message.prefix + " Set mode " + modeStr);
	}
	else if(message.command == "TOPIC")
	{
		writeLog(message.channel, message.prefix + " Set topic " + message.content);
	}
	else if(message.command == "NICK")
	{
		for(var channel in channelLogStream)
			writeLog(channel, message.prefix + " Changes nick to " + message.channel);
	}
	else if(message.command == "QUIT")
	{
		for(var channel in channelLogStream)
		{
			writeLog(channel, message.prefix + " Quits. (" + message.channel + ")");
		}
	}
}

function unload()
{
	console.log("Unloading logger.js\n");
	for(var channel in channelLogStream)
		closeLogStream(channel);
}
