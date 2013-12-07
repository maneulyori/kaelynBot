var spawn = require('child_process').spawn;
var maximaProcessHT = new Object();

var client;

exports.init = init;
exports.messageHandler = messageHandler;

var maxima = spawn('maxima', []);

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: { command: ["maxima"] }, callBack: messageHandler, unloadCallback: unload };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "maxima")
	{
		if(message.splitedMessage[1] == "재시동")
		{
			client.privmsg(message.channel, "Restarting maxima process...");
			maxima.kill('SIGKILL');
			maxima = spawn('maxima', []);
			client.privmsg(message.channel, "Restarting finished.");
		}


		client.privmsg (message.channel, "Placeholder!");
	}
}

function unload()
{
	maxima.kill('SIGKILL');
}
