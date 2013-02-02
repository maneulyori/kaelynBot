var sqlite = require('sqlite3');

exports.init = init;
exports.messageHandler = messageHandler;

var client;

function init (initArg)
{
	client = initArg.client;

	return { moduleCommand: { command: ["부재"] }, callBack: messageHandler, promiscCallBack: promiscMessageHandler, unloadCallback: unload};
}

function messageHandler(message)
{
	client.privmsg(message.channel, "메시지 박스 코드 작성 중... 일단 " + client.modifiedNick + "님 부재중으로 설정합니다");
}

function promiscMessageHandler(message)
{
	//
}

function unload()
{
	//
}
