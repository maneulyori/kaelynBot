var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: {IRCcommand: ["INVITE"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.command == "INVITE")
	{
		client.join(message.args[1]);
		client.privmsg(message.args[1], "헤헤 " + message.nick + "님 초대해 줘서 고마워요!");
	}
}
