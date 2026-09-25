module.exports = {
  name: 'ping',
  async execute(message, args, client) {
    return message.reply(`🏓 Pong! API latency: ${Math.round(client.ws.ping)}ms`);
  }
};
