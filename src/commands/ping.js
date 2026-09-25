module.exports = {
  name: 'ping',
  async execute(message, args, client) {
    const msg = await message.reply('🏓 Ping...');
    const latency = msg.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    msg.edit(`🏓 Pong!\n**Latency**: ${latency}ms\n**API Latency**: ${apiLatency}ms`);
  }
};
