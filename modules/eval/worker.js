process.on('message', function(msg) {

    var vm = require("vm");

    var sandbox = {
		out: ""
	};

	var prefix = "function print(str) { out += str; }";

	try{
    	var script = vm.createScript(prefix + ";" + msg);
    	script.runInNewContext(sandbox);
	}
	catch (e)
	{
		if(e == null)
		{
			sandbox.out = "throw null 해서 뭐 하겠다고?";
		}
		else if(typeof(e) == 'undefined')
		{
			if(typeof(e.name) != 'undefined' && typeof(e.message) != 'undefined')
				sandbox.out = e.name + ": " + e.message;
			else
				sandbox.out = "이상한 거 throw 하지 마!"
		}
		else
		{
			sandbox.out = "throw undefined 해서 뭐 하겠다고?";
		}
	}

	var outArr = sandbox.out.split("\n");

    process.send(outArr); //Send the finished message to the parent process
});
