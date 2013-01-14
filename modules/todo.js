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
		client.privmsg (message.args[0], "TODO: Add channel blacklist");
		//client.privmsg (message.args[0], "TODO: Project spellcaster");
		client.privmsg (message.channel, "TODO: sqlite DBAPI");
	}
}
