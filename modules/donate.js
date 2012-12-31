var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: {command: ["마늘기부"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "마늘기부")
	{
		client.privmsg (message.channel, "좀비에게 카페인을 하나은행 725-910132-94707 PayPal: maneulyori@gmail.com");
		client.privmsg (message.channel, "BTC wallet: 17WZTVMUCfkCJnL4593DfvQ7eBkAqAj9N2");
	}
}
