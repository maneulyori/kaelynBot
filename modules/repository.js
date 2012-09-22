var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleType: "command", moduleCommand: ["소스"], callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "소스")
	{
		client.privmsg (message.args[0], "이 봇의 소스는 GPL v3 아래에 공개되어 있으며, 이 곳에서 열어보실 수 있습니다. https://github.com/maneulyori/garlicBot");
	}
}
