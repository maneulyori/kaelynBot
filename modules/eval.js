var vm = require("vm");

var client;

exports.init = init;
exports.messageHandler = messageHandler;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: {command: ["eval"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.moduleCommand == "eval")
	{
			/*
		for (var nick in whitelist)
		{
			if(message.prefix == whitelist[nick])
			{*/
				var sandbox = {
					out : "",
				}
				var source = message.content.match(/([^\s]+)\ (.+)/);
				var compiledScript = vm.createScript(source[2]);

				compiledScript.runInNewContext(sandbox);

				client.privmsg(message.channel, sandbox.out);
			//}
		//}
	}
}
