var client;
var exec = require('child_process').exec;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: {command: ["시간"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "시간")
	{
		var uptime = exec('date', function(error, stdout, stderr) {
			client.privmsg (message.args[0], stdout);
		});
	}
}
