var util = require('util');
var net = require('net');
var replyFor = require('./codes.js');

exports.client = client;

function client(server, port, encoding)
{
	var self = this;
	self.client = net.connect(port, server);
	self.buffer = '';
	self.nick = '';

	self.client.on('data', function(data) { getMessage(data, self.encoding, self)});
	console.log("connection succeed to " + server + ":" + port);

	self.registeredCallback = function(callback)
	{
		self.registeredCallbackFunc = callback;
	}

	self.messageCallback = function(callback)
	{
		self.messageCallbackFunc = callback;
	}

	self.raw = function (rawmsg)
	{
		console.log(rawmsg);
		this.client.write(rawmsg + "\r\n");
	}

	self.register = function (username, usermode, realname, nick)
	{
		self.raw("USER " + username + " " + usermode + " " + "0" + " " + realname);
		self.raw("NICK " + nick);

		self.nick = nick;

		console.log("registered as " + username);
	}

	self.pong = function(message)
	{
		self.raw("PONG "+message);
	}

	self.privmsg = function(target, message)
	{
		self.raw("PRIVMSG " + target + " " + message);
	}

	self.notice = function(target, message)
	{
		self.raw("NOTICE " + target + " " + message);
	}

	self.kick = function(channel, target, message)
	{
		self.raw("KICK " + channel + " " + target + " " + message);
	}

	self.join = function(target)
	{
		self.raw("JOIN " + target);
	}

	self.part = function(target, msg)
	{
		self.raw("PART "+target+" "+msg);
	}

	self.quit = function(msg)
	{
		self.raw("QUIT " + msg);
	}
}

function getMessage(data, encoding, client)
{
	//console.log(data.toString(encoding));

	client.buffer += data.toString(encoding);

	var lines = client.buffer.split("\r\n");
	client.buffer = lines.pop();

	lines.forEach(function(line) { 
		var message = parseMessage(line, false);

		if(message.command == "PING")
		{
			client.pong(message.args[0]);
		}
		if(message.command == "001")
		{
			console.log("First message arrived!");
			client.registeredCallbackFunc();
		}
	
		if(typeof(client.messageCallbackFunc) == "function")
		{
			client.messageCallbackFunc(message);
		}
	});
}

/*
 * parseMessage(line, stripColors)
 *
 * takes a raw "line" from the IRC server and turns it into an object with
 * useful keys
 */
function parseMessage(line, stripColors) {
    var message = {};
    var match;
    if (stripColors) {
        line = line.replace(/[\x02\x1f\x16\x0f]|\x03\d{0,2}(?:,\d{0,2})?/g, "");
    }
    // Parse prefix
    if ( match = line.match(/^:([^ ]+) +/) ) {
        message.prefix = match[1];
        line = line.replace(/^:[^ ]+ +/, '');

        if ( match = message.prefix.match(/(.*)\!(.*)@(.*)/) ) {
			message.nick = match[1];
            message.user = match[2];
            message.host = match[3];
        }
        else {
            message.server = message.prefix;
        }
    }
    // Parse command
    match = line.match(/^([^ ]+) */);
    message.command = match[1];
    message.rawCommand = match[1];
    message.commandType = 'normal';
    line = line.replace(/^[^ ]+ +/, '');
    if ( replyFor[message.rawCommand] ) {
        message.command     = replyFor[message.rawCommand].name;
        message.commandType = replyFor[message.rawCommand].type;
    }
    message.args = [];
    var middle, trailing;
    // Parse parameters
    if ( line.indexOf(':') != -1 ) {
        match = line.match(/(.*)(?:^:|\s+:)(.*)/);
        middle = match[1].trimRight();
        trailing = match[2];
    }
    else {
        middle = line;
    }
    if ( middle.length )
        message.args = middle.split(/ +/);
    if ( typeof(trailing) != 'undefined' && trailing.length )
        message.args.push(trailing);

	message.channel = message.args[0];
    return message;
}	
