process.on('message', function(source) {

    var vm = require("vm");

    var sandbox = {
		out: "",
		print: function(str) { out += str }
	};

    var script = vm.createScript(source);

    script.runInNewContext(sandbox);

    process.send(sandbox.out); //Send the finished message to the parent process

	process.exit();
});
