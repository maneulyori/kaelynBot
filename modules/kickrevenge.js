var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: {IRCcommand: ["KICK"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.command == "KICK")
	{
		if(client.nick == message.args[1])
		{
			client.join(message.channel);
			client.kick(message.channel, message.nick, message.args[2]);
//client.notice(message.nick, "우앵 " + message.args[2] + "라니 너무해!");
		}
	}
}
