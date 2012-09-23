var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleType: "command", moduleCommand: ["exception"], callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "exception")
	{
		throw new Error(message.splitedMessage[1]);
	}
}
