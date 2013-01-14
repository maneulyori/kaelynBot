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
				client.privmsg(workerTable[worker], msg[i]);
			}

			worker.destroy(); //Don't leave him hanging 
			delete workerTable[worker];
		});

		timer = setTimeout( function() {
			worker.destroy(); //Give it 5 seconds to run, then abort it
			client.privmsg(workerTable[worker], "worker timed out");
			delete workerTable[worker];
		}, 1000);
	});

	return { moduleCommand: {command: ["eval"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.moduleCommand == "eval")
	{
		var source = message.content.match(/([^\s]+)\ (.+)/)[2];

		var worker = cluster.fork();

		workerTable[worker] = message.channel;
		
		worker.send(source); //Send the code to run for the worker
	}
}
