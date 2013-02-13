var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: {command: ["TODO"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "TODO")
	{
		client.privmsg (message.channel, "TODO: Add channel blacklist");
		client.privmsg (message.channel, "TODO: sqlite DBAPI");
	}
}
