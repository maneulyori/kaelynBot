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

function clone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

//config area
var modulepath = "./modules";
var commandPrefix = "#";

//get list of files in module dir.
var modulelist = fs.readdirSync(modulepath);

console.log(modulelist.length + " modules detected in "+modulepath+". Avaliable modules are: " + modulelist);

var client = new irc.client('kanade.irc.ozinger.org', '6667', "UTF-8");

client.register("kaelyn_dove", "kaelyn_dove", "0", "kaelyn_dove", "kaelyn_dove");

client.registeredCallback(function() {

	try {
		var config = require('./config.json');
		client.raw("/nickserv identify " + config.nickserv);
	}
	catch (e)
	{
		//
	}

	client.join("#이과무스메");
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
			delete require.cache[require.resolve(modulepath+"/"+modulelist[i])];

			try {
				var usermodule = require(modulepath+"/"+modulelist[i]);

				var moduleAPI = usermodule.init({ client: client });
	
				moduleAPI.modName = (moduleAPI.modName || modulelist[i]);

				modules.push({ moduleAPI: moduleAPI });
			}
			catch (err) {
				console.log("module " + modulelist[i] + " failed to load");
			}
		}
	}
}

client.messageCallback(function(message) {

	var processedMessage = clone(message);
	
	processedMessage.isCommand = false;
	processedMessage.splitedMessage = new Array();

	if(processedMessage.command == 'PRIVMSG')
	{
		if(((processedMessage.args[1] || '').startsWith(commandPrefix)) || (processedMessage.args[1] || '').startsWith('!'))
		{
			processedMessage.isCommand = true;
			processedMessage.args[1] = (message.args[1] || '').substring(commandPrefix.length, (message.args[1] || '').length);
			processedMessage.splitedMessage = processedMessage.args[1].split(" ");
		}
	}

	if(processedMessage.isCommand)
	{
		if(processedMessage.splitedMessage[0] == "모듈")
		{
			if(processedMessage.splitedMessage[1] == "reload")
			{
				client.privmsg(message.args[0], "Reloading all modules....");

				while(modules.length > 0)
				{
					if(typeof(modules[0].unloadCallback) == 'Function')
					{
						modules[0].unloadCallback();
					}
					modules.remove(0);
				}

				modLoader();

				client.privmsg(message.args[0], modules.length + " modules detected in "+modulepath+". Avaliable modules are: " + modulelist);
				client.privmsg(message.args[0], "Finished module loading.");
			}
			else
			{
				client.privmsg(message.args[0], modules.length + " modules detected in "+modulepath+". Avaliable modules are: " + modulelist);
			}
		}

		if(processedMessage.splitedMessage[0] == "명령")
		{
			var commandString = '명령: ';

			for(i=0; i<modules.length; i++)
			{
				if(modules[i].moduleAPI.moduleType == "command")
				{
					for(j=0; j<modules[i].moduleAPI.moduleCommand.length; j++)
					{
						commandString += commandPrefix + modules[i].moduleAPI.moduleCommand[j] + ' ';
					}
				}
			}
			
			client.privmsg(message.args[0], commandString);
		}
	}

	for(i=0; i<modules.length; i++)
	{
		try {
			if(modules[i].moduleAPI.moduleType == "IRCcommand")
			{
				for(j=0; j<modules[i].moduleAPI.moduleCommand.length; j++)
				{
					if(modules[i].moduleAPI.moduleCommand[j] == message.command)
						modules[i].moduleAPI.callBack(message);
				}
			}
		}
		catch (e)
		{
			client.privmsg(processedMessage.args[0], "Exception " + e + " detected in module " + modules[i].moduleAPI.modName);
			console.log("Exception " + e + " detected in module " + modules[i].moduleAPI.modName);
		}
	}
	
	if(processedMessage.isCommand)
	{		
		for(i=0; i<modules.length; i++)
		{
			try {
				if(modules[i].moduleAPI.moduleType == "command")
				{
					for(j=0; j<modules[i].moduleAPI.moduleCommand.length; j++)
					{
						if(modules[i].moduleAPI.moduleCommand[j] == processedMessage.splitedMessage[0])
							modules[i].moduleAPI.callBack(processedMessage);
					}
				}
			}
			catch (e)
			{
				client.privmsg(processedMessage.args[0], "Exception " + e + " detected in module " + modules[i].moduleAPI.modName);
				console.log("Exception " + e + " detected in module " + modules[i].moduleAPI.modName);
				console.log(e.stack);
			}
		}
	}

	if(message.args[1] == "!TODO:")
	{
		client.privmsg(message.args[0], "TODO: Add channel blacklist");
	}
});
