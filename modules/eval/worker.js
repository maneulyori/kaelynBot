process.on('message', function(msg) {

    var vm = require("vm");

    var sandbox = {
		out: ""
	};

	var prefix = "function print(str) { out += str; }";

    var script = vm.createScript(prefix + ";" + msg);

	try {
    	script.runInNewContext(sandbox);
	}
	catch (e)
	{
		sandbox.out = e.message;
	}

	var outArr = sandbox.out.split("\n");

    process.send(outArr); //Send the finished message to the parent process
});
