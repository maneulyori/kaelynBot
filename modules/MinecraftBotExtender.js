var client;

exports.init = init;
exports.messageHandler = messageHandler;

var eccsbit = false;

function startsWith (str, prefix) {
	return str.indexOf(prefix) === 0;
}

function setCharAt(str,index,chr) {
	if(index > str.length-1) return str;
	return str.substr(0,index) + chr + str.substr(index+1);
}

if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function (str){
		return this.slice(-str.length) == str;
	};
}

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: { command: ["ECCS"] }, callBack: messageHandler, promiscCallBack: promiscMessageHandler, isPromisc: true };
}

function messageHandler(message)
{
	//
}

function promiscMessageHandler(message)
{
	if (message.channel == "#MeltCraft" && message.nick == "maneulyori")
	{
		//var parsedMessage = message.content.match(/<[a-zA-Z]*> .*/);
		//console.log(parsedMessage);
	}
}

