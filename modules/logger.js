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

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: { command: ["로깅"], IRCcommand: ["KICK", "JOIN", "PART"] }, callBack: messageHandler, promiscCallBack: promiscMessageHandler, isPromisc: true, unloadCallback: unload };
}

function getTimestamp(date)
{
	var timestamp = date.getFullYear().zeroPad(1000) + '-' + (date.getMonth()+1).zeroPad(10) + '-' + date.getDate().zeroPad(10) + ' ' + date.getHours().zeroPad(10) + ':' + date.getMinutes().zeroPad(10) + ':' + date.getSeconds().zeroPad(10);

	return timestamp;
}

function writeLog(channel, message)
{
	var date = new Date();
	var timestamp = getTimestamp(date);
	if(channelLogStream[channel] == undefined)
	{
		channelLogStream[channel] = fs.createWriteStream("logs/" + channel + ".log", { flags: "a", encoding: "UTF-8", mode: 0666});
		channelLogStream[channel].write("Start logging at " + date  + "\n");
	}
	channelLogStream[channel].write(message, "UTF-8");
}

function messageHandler(message)
{
	var date = new Date();
	var timestamp = getTimestamp(date);

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
	else if(message.command == "KICK")
	{
		writeLog(message.channel, timestamp + " " + message.nick + " kicks " + message.args[1] + " (" + message.args[2] + ")\n")
	}
	else if(message.command == "JOIN")
	{
		writeLog(message.channel, timestamp + " " + message.nick + " Joins.\n");
	}
	else if(message.command == "PART")
	{
		writeLog(message.channel, timestamp + " " + message.nick + " Parts. (" + message.args[1] + ")\n");
	}
}

function promiscMessageHandler(message)
{
	var date = new Date();
	var timestamp = date.getFullYear().zeroPad(1000) + '-' + (date.getMonth()+1).zeroPad(10) + '-' + date.getDate().zeroPad(10) + ' ' + date.getHours().zeroPad(10) + ':' + date.getMinutes().zeroPad(10) + ':' + date.getSeconds().zeroPad(10);
	if(channelLogStream[message.channel] == undefined)
	{
		channelLogStream[message.channel] = fs.createWriteStream("logs/" + message.channel + ".log", { flags: "a", encoding: "UTF-8", mode: 0666});
		channelLogStream[message.channel].write("Start logging at " + date + "\n");
	}
	channelLogStream[message.channel].write(timestamp + " " + '<' + message.nick + '> ' + message.content + '\n', "UTF-8");
}

function unload()
{
	console.log("Unloading logger.js\n");
	for(var channel in channelLogStream)
	{
		console.log("Closing log stream: " + channel + "\n");
		channelLogStream[channel].end("Logging ends at " + new Date() + "\n", "UTF-8");
	}
}

