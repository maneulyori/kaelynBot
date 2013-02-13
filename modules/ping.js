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
		client.privmsg (message.channel, message.nick + ", 퐁!");
	}
	else if(message.splitedMessage[0] == "퐁")
	{
		client.privmsg(message.channel, message.nick + ", 핑!... 어라 이상한데?");
	}
}
