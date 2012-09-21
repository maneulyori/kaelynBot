var irc = require('./irc.js');
var fs = require('fs');

var modules = new Array();

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

String.prototype.startsWith = function(prefix) {
	return this.indexOf(prefix) === 0;
}

if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function (str){
	return this.slice(-str.length) == str;
	};
}

//config area
var modulepath = "./modules";
var commandPrefix = "!";

//get list of files in module dir.
var modulelist = fs.readdirSync(modulepath);

console.log(modulelist.length + " modules detected in "+modulepath+". Avaliable modules are: " + modulelist);

var client = new irc.client('kanade.irc.ozinger.org', '6667', "UTF-8");

client.register("KellanKyra", "KellanKyra", "0", "KellanKyra", "KellanKyra");

client.registeredCallback(function() {
//client.privmsg("오징오징어", "identify c8200220f");

//client.join("#이과무스메");
client.join("#uncyclopedia");
client.join("#");
});

modLoader();

function modLoader()
{
	modulelist = fs.readdirSync(modulepath);
	for(i=0; i<modulelist.length; i++)
	{
		if(modulelist[i].endsWith(".js"))
		{
			var module = require(modulepath+"/"+modulelist[i]);
			try {
				var modAPI = module.init({ client: client });
	
				modAPI.modName = (modAPI.modName || modulelist[i]);

				modules.push({ modAPI: modAPI });
			}
			catch (err) {
				console.log("module " + modulelist[i] + " failed to load");
			}
		}
	}
}

client.messageCallback(function(message) {

	if(message.args[1] == "!모듈")
	{
		client.privmsg(message.args[0], modules.length + " modules detected in "+modulepath+". Avaliable modules are: " + modulelist);
	}

	if(message.args[1] == "!모듈 reload")
	{
		client.privmsg(message.args[0], "Reloading all modules....");

		while(modules.length > 0)
			modules.remove(0);

		modLoader();
		client.privmsg(message.args[0], modules.length + " modules detected in "+modulepath+". Avaliable modules are: " + modulelist);
		client.privmsg(message.args[0], "Finished module loading.");
	}

	for(i=0; i<modules.length; i++)
	{
		try {
			if(modules[i].modAPI.moduleType == "IRCcommand")
			{
				if(modules[i].modAPI.moduleCommand == message.command)
					modules[i].modAPI.callBack(message);
			}
		}
		catch (e)
		{
			//
		}
	}

	var splitedMessage = (message.args[1] || '').split(" ");
	
	if(splitedMessage[0].startsWith(commandPrefix))
	{
		console.log("Command detected!");
		for(i=0; i<modules.length; i++)
		{
			try {
				if(modules[i].modAPI.moduleType == "command")
				{
					console.log(modules[i]);
					var modifiedMessage = message;

					modifiedMessage.args[1] = message.args[1].substring(commandPrefix.length, modifiedMessage.args[1].length);
					modules[i].modAPI.callBack(modifiedMessage);
				}
			}
			catch (e)
			{
				console.log("Exception " + e + " detected in module " + modules[i].modAPI.modName);
			}
		}
	}

	if(message.args[1] == "!TODO:")
	{
		client.privmsg(message.args[0], "TODO: Add channel blacklist");
	}
});
