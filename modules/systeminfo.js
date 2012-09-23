var client;
var exec = require('child_process').exec;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleType: "command", moduleCommand: ["업타임", "쿨링팬", "온도"], callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "업타임")
	{
		var uptime = exec('uptime', function(error, stdout, stderr) {
			client.privmsg (message.args[0], stdout);
		});
	}
	else if(message.splitedMessage[0] == "쿨링팬")
	{
		var sensors = exec('echo "CPU Fan: " $(sensors | grep fan1)', function(error, stdout, stderr) {
			client.privmsg (message.args[0], stdout);
		});
	}
	else if(message.splitedMessage[0] == "온도")
	{
		var gputemp = exec('nvidia-smi -q -d TEMPERATURE | grep Gpu', function(error, stdout, stderr) {
			client.privmsg (message.args[0], stdout);
		});
	}
}
