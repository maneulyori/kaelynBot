var spawn = require('child_process').spawn;

var client;

exports.init = init;
exports.messageHandler = messageHandler;

var maxima = spawn('maxima', []);

function init (initArg)
{
	client = initArg.client;

	return { moduleType: "command", moduleCommand: ["maxima"], callBack: messageHandler, unloadCallback: unload };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "maxima")
	{
		if(message.splitedMessage[1] == "재시동")
		{
			client.privmsg(message.args[0], "Restarting maxima process...");
			maxima.kill('SIGKILL');
			maxima = spawn('maxima', []);
			client.privmsg(message.args[0], "Restarting finished.");
		}


		client.privmsg (message.args[0], "Placeholder!");
	}
}

function unload()
{
	maxima.kill('SIGKILL');
}
