var vm = require("vm");
var cluster = require("cluster");

var client;

exports.init = init;
exports.messageHandler = messageHandler;

cluster.setupMaster({
	exec : "eval/worker.js",
	args : process.argv.slice(2),
	silent : false
});

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: {command: ["eval"]}, callBack: messageHandler };
}

function messageHandler(message)
{
	if(message.moduleCommand == "eval")
	{
		var source = message.content.match(/([^\s]+)\ (.+)/)[2];

		//This will be fired when the forked process becomes online
		cluster.on( "online", function(worker) {
			var timer = 0;

			worker.on( "message", function(msg) {
				clearTimeout(timer); //The worker responded in under 1 seconds, clear the timeout
				console.log(msg);
			worker.destroy(); //Don't leave him hanging 
			});

			timer = setTimeout( function() {
				worker.destroy(); //Give it 5 seconds to run, then abort it
				client.privmsg(message.channel, "worker timed out");
			}, 1000);

			worker.send(source); //Send the code to run for the worker

			cluster.fork();
		});
	}
}
