process.on('message', function(source) {

    var vm = require("vm");

    var obj = {
		out: ""
		print: function(str) { out += str };
	};
    var ctx = vm.createContext(obj);

    var script = vm.createScript(source);

    script.runInNewContext(ctx);

    process.send(out); //Send the finished message to the parent process
});
