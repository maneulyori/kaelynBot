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

	return { moduleCommand: { command: ["ECCS"] }, callBack: messageHandler, promiscCallBack: promiscMessageHandler};
}

function messageHandler(message)
{
	if (message.splitedMessage[0] == 'ECCS')
	{
		client.privmsg(message.channel, 'eccsbit is set to ' + !eccsbit);
		eccsbit = !eccsbit;
	}
}

function promiscMessageHandler(message)
{
	if (!eccsbit)
	if (startsWith(message.content, '！'))
	{
		returnMessage = message.content;
		returnMessage = '!' + returnMessage.substring('！'.length, returnMessage.length);

		client.privmsg(message.channel, returnMessage);
	}
}

