var vm = require("vm");

var client;

exports.init = init;
exports.messageHandler = messageHandler;

var whitelist = ["마늘!garlic@elrond.maneulyori.org"];

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: {command: ["eval"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.command == "eval")
	{
		for (var nick in whitelist)
		{
			if(message.prefix == nick)
			{
				var sandbox = {
					out : "",
				}
				var source = message.content.match(/([^\s]+)\ (.+)/);
				var compiledScript = vm.createScript(source);

				compiledScript.runInNewContext(sandbox);

				client.privmsg(message.channel, sandbox.out);
			}
		}
	}
}
