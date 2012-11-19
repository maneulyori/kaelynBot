var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: {command: ["핑", "퐁"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "핑")
	{
		client.privmsg (message.args[0], message.nick + ", 퐁!");
	}
	else if(message.splitedMessage[0] == "퐁")
	{
		client.privmsg(message.args[0], "E: 시간 역행 탐지됨.");
	}
}
