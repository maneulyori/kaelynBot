var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleType: "IRCcommand", moduleCommand: ["KICK"], callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.command == "KICK")
	{
		client.notice(message.nick, "우앵 " + message.args[2] + "라니 너무해!");
	}
}
