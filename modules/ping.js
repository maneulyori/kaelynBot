var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleType: "command", moduleCommand: ["핑"], callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "핑")
	{
		client.privmsg (message.args[0], message.nick + ", 퐁!");
	}
}
