var client;
var exec = require('child_process').exec;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: {command: ["업타임", "쿨링팬", "온도", "uname"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "업타임")
	{
		var uptime = exec('uptime', function(error, stdout, stderr) {
			client.privmsg (message.channel, stdout);
		});
	}
	else if(message.splitedMessage[0] == "쿨링팬")
	{
		var sensors = exec('echo "CPU Fan: " $(sensors | grep fan1)', function(error, stdout, stderr) {
			client.privmsg (message.channel, stdout);
		});
	}
	else if(message.splitedMessage[0] == "온도")
	{
		var gputemp = exec('nvidia-smi -q -d TEMPERATURE | grep Gpu', function(error, stdout, stderr) {
			client.privmsg (message.channel, stdout);
		});
	}
	else if(message.splitedMessage[0] == "uname")
	{
		var uname = exec('uname -a', function(error, stdout, stderr) {
			client.privmsg(message.channel, stdout);
		});
	}
}
