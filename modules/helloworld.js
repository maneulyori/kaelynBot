var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleType: "command", moduleCommand: ["안녕", "hello", "moi", "aiya"], callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "안녕")
	{
		client.privmsg (message.args[0], "세상아!");
	}
	else if(message.splitedMessage[0] == "hello")
	{
		client.privmsg(message.args[0], "world!");
	}
	else if(message.splitedMessage[0] == "moi")
	{
		client.privmsg(message.args[0], "maailma!");
	}
	else if(message.splitedMessage[0] == "aiya")
	{
		client.privmsg(message.args[0], "ambar!");
	}
}
