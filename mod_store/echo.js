var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: "", callBack: messageHandler, promiscCallBack: promiscMessageHandler, isPromisc: true };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "핑")
	{
		client.privmsg (message.args[0], message.nick + ", 퐁!");
	}
}

function promiscMessageHandler(message)
{
	client.privmsg(message.channel, message.content);
}

