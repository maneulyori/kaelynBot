
if(message.command == "JOIN")
{
	if(message.nick != "kaelyn_dove")
	{
		if(message.nick != "켈렘보르")
			client.privmsg(message.args[0], message.nick + "님 반갑!");
		else
			client.privmsg(message.args[0], "켈렘보르 ㅗㅗㅗㅗㅗㅗㅗㅗㅗㅗㅗㅗㅗ")
	}
}
