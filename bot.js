var irc = require('./irc.js');
var fs = require('fs');
var sqlite = require('sqlite3');
var tls = require('tls');

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

var modulepath = "./modules";

//get list of files in module dir.
var modulelist = fs.readdirSync(modulepath);

console.log(modulelist.length + " modules detected in "+modulepath+". Avaliable modules are: " + modulelist);

console.log("Reading config.json...");

//load configuration from file
var config = require('./config.json');

var client = new irc.client(config.ircserver, config.ircport, config.ircencoding, config.useSSL);

client.register(config.user, config.usermode, config.realname, config.nick);

client.registeredCallback(function() {

	if(config.nickserv != undefined)
	{
		client.raw("nickserv identify " + config.nickserv);
	}

	config.channels.forEach( function (channel) {
		client.join(channel);
	});
});

process.on('SIGINT', function () {
	console.log("Ctrl-C received! Terminating...");

	client.quit("Ctrl-C receieved! Terminating...");

	console.log("Unloading modules...");

	while(modules.length > 0)
	{
		if(typeof(modules[0].moduleAPI.unloadCallback) == 'function')
		{
			modules[0].moduleAPI.unloadCallback();
		}

		modules.remove(0);
	}

	process.exit(0);
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

				var moduleAPI = usermodule.init({ client: client, moduleAPICall: moduleAPICall, sqlite: sqlite });
	
				moduleAPI.modName = (moduleAPI.modName || modulelist[i]);

				modules.push({ moduleAPI: moduleAPI, module: usermodule });
			}
			catch (e) {
				console.log("module " + modulelist[i] + " failed to load");
				console.log(e.stack);
			}
		}
	}
}

function moduleAPICall(modName, functionName)
{
	var splitedCall = functionName.split('.');
	var methode;
/*
	arguments = arguments.remove(0);
	arguments = arguments.remove(0);
*/
	var args = new Array;

	for(i=2; i<arguments.length; i++)
	{
		args[i-2] = args[i];
	}

	delete args[args.length-1];
	delete args[args.length-1];

	for(i=0; i<modules.length; i++)
	{
		if(modules[i].moduleAPI.modName == modName)
		{
			methode = modules[i].module;

			for(j=0; j<splitedCall.length; j++)
			{
				methode = methode[splitedCall[j]];
			}

			return methode(args);
		}
	}

	throw new Error ("Cannot find module " + modName);
}

client.messageCallback(function(message) {

	var processedMessage = clone(message);
	
	processedMessage.isCommand = false;
	processedMessage.splitedMessage = new Array();
	processedMessage.channel = processedMessage.args[0];
	processedMessage.content = processedMessage.args[1];

	if(processedMessage.command == 'PRIVMSG')
	{
		if(((processedMessage.args[1] || '').startsWith(config.commandPrefix)) || (processedMessage.args[1] || '').startsWith('!'))
		{
			processedMessage.isCommand = true;
			processedMessage.args[1] = (message.args[1] || '').substring(config.commandPrefix.length, (message.args[1] || '').length);
			processedMessage.splitedMessage = processedMessage.args[1].split(" ");
			processedMessage.moduleCommand = processedMessage.splitedMessage[0];
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
					if(typeof(modules[0].moduleAPI.unloadCallback) == 'function')
					{
						modules[0].moduleAPI.unloadCallback();
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
				if(modules[i].moduleAPI.moduleCommand.command != undefined)
				{
					for(j=0; j<modules[i].moduleAPI.moduleCommand.command.length; j++)
					{
						commandString += config.commandPrefix + modules[i].moduleAPI.moduleCommand.command[j] + ' ';
					}
				}
			}
			
			client.privmsg(message.args[0], commandString);
		}
	}

	for(this.i=0; this.i<modules.length; this.i++)
	{
		try {
			if(modules[this.i].moduleAPI.moduleCommand.IRCcommand != undefined)
			{
				for(this.j=0; this.j<modules[this.i].moduleAPI.moduleCommand.IRCcommand.length; this.j++)
				{
					if(modules[this.i].moduleAPI.moduleCommand.IRCcommand[this.j] == message.command)
						modules[this.i].moduleAPI.callBack(message);
				}
			}
			
			if(processedMessage.isCommand)
			{
				if(modules[this.i].moduleAPI.moduleCommand.command != undefined)
				{
					for(this.j=0; this.j<modules[this.i].moduleAPI.moduleCommand.command.length; this.j++)
					{
						if(modules[this.i].moduleAPI.moduleCommand.command[this.j] == processedMessage.splitedMessage[0])
							modules[this.i].moduleAPI.callBack(processedMessage);
					}
				}
			}
			
			if(modules[this.i].moduleAPI.isPromisc && message.command == "PRIVMSG")
			{
				modules[this.i].moduleAPI.promiscCallBack(processedMessage);
			}
		}
		catch (e)
		{
			if(processedMessage.isCommand)
				client.privmsg(processedMessage.args[0], "Exception " + e + " detected in module " + modules[i].moduleAPI.modName);
	
			console.log("Exception " + e + " detected in module " + modules[i].moduleAPI.modName);
			console.log(e.stack);
		}
	}
});
