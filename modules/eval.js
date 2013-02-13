var vm = require("vm");
var cluster = require("cluster");

var client;

exports.init = init;
exports.messageHandler = messageHandler;

var workerTable = new Object();

cluster.setupMaster({
	exec : "modules/eval/worker.js",
	args : process.argv.slice(2),
	silent : false
});

var maxMsgLen = 300;

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
}

function init (initArg)
{
	client = initArg.client;
	
	//This will be fired when the forked process becomes online
	cluster.on( "online", function(worker) {
		var timer = 0;

		worker.on( "message", function(msg) {
			clearTimeout(timer); //The worker responded in under 1 seconds, clear the timeout

			for(var i in msg)
			{
				if ( i < 3 ) 
				client.privmsg(workerTable[worker], msg[i].substring(0, maxMsgLen));
			}

			worker.destroy(); //Don't leave him hanging 
			delete workerTable[worker];
		});

		timer = setTimeout( function() {
			worker.destroy(); //Give it 1 seconds to run, then abort it
			client.privmsg(workerTable[worker], "worker timed out");
			delete workerTable[worker];
		}, 1000);
	});

	return { moduleCommand: {command: ["js"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.args[1].startsWith('$'))
	if(message.moduleCommand == "js")
	{
		try {
			var source = message.content.match(/([^\s]+)\ (.+)/)[2];
		
			var worker = cluster.fork();
			workerTable[worker] = message.channel;
		
			worker.send(source); //Send the code to run for the worker
		}
		catch (e)
		{
			client.privmsg(message.channel, "js: 자바스크립트 소스를 실행합니다.");
			client.privmsg(message.channel, "사용할 수 있는 모듈에는 dns, url, jsdom, util, os가 있습니다.");
		}
	}
}
