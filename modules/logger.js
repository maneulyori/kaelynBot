var fs = require('fs');

var client;
var channelHT = new Object();
var channelLogStream = new Object();

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: { command: ["로깅"], IRCcommand: ["KICK"] }, callBack: messageHandler, promiscCallBack: promiscMessageHandler, isPromisc: true, unloadCallback: unload };
}

function messageHandler(message)
{
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
		if(channelLogStream[message.channel] == undefined)
		{
			channelLogStream[message.channel] = fs.createWriteStream("logs/" + message.channel + ".log", { flags: "a", encoding: "UTF-8", mode: 0666});
			channelLogStream[message.channel].write("Start logging at " + new Date() + "\n");
		}
		channelLogStream[message.channel].write(message.nick + " kicks " + message.args[1] + " (" + message.args[2] + ")\n", "UTF-8");
	}
}

function promiscMessageHandler(message)
{
	if(channelLogStream[message.channel] == undefined)
	{
		channelLogStream[message.channel] = fs.createWriteStream("logs/" + message.channel + ".log", { flags: "a", encoding: "UTF-8", mode: 0666});
		channelLogStream[message.channel].write("Start logging at " + new Date() + "\n");
	}
	channelLogStream[message.channel].write('<' + message.nick + '> ' + message.content + '\n', "UTF-8");
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

