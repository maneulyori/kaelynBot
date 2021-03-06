process.on('message', function(msg) {

    var vm = require("vm");

    var sandbox = {
		dns: require("dns"),
		url: require("url"),
		jsdom: require("jsdom"),
		util: require("util"),
		os: require("os"),
		out: ""
	};

	var prefix = "function print(str) { if(typeof(str) == 'string') { out += str; return ;} else { for (var property in str) { out += property + ': ' + str[property] + '; '; }; }; }";

	try{
	console.log("Executing script\n");
    	var script = vm.createScript(prefix + ";" + msg);
    	script.runInNewContext(sandbox);
	}
	catch (e)
	{
		if(e == null)
		{
			sandbox.out = "throw null 해서 뭐 하겠다고?";
		}
		else if(typeof(e) != 'undefined')
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

	if(sandbox.out.length == 0)
	{
		sandbox.out = "출력 없음.";
	}

	var outArr = sandbox.out.split("\n");

    process.send(outArr); //Send the finished message to the parent process
});
