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
		if(typeof(e) != 'undefined')
		{
			if(typeof(e.name) != 'undefined' && typeof(e.message) != 'undefined')
				sandbox.out = e.name + ": " + e.message;
			else
				sandbox.out = "에러 던질거면 제대로 던져 ㅗ"
		}
		else
			sandbox.out = "에러 던질거면 제대로 던져 ㅗ undefined 던져서 뭐 하겠다고?";
	}

	var outArr = sandbox.out.split("\n");

    process.send(outArr); //Send the finished message to the parent process
});
