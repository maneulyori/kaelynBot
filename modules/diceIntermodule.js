var client;

exports.init = init;
exports.messageHandler = messageHandler;

var dice;
var moduleAPICall;

function init (initArg)
{
	client = initArg.client;
	moduleAPICall = initArg.moduleAPICall;

	return { moduleCommand: {command: ["d20Intermodule"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.splitedMessage[0] == "d20Intermodule")
	{
		var diceString = message.args[1].match(/([^\s]+)\ (.+)/);

		var diceResult = moduleAPICall("dice.js", "diceRoller", diceString[2]);

		client.privmsg (message.channel, "TOTAL: "+diceResult.total);
		client.privmsg (message.channel, "Rolls: "+diceResult.rolls);
	}
}
