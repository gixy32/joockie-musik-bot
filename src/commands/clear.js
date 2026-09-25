module.exports = {
  name: 'clear',
  async execute(message, args, client) {
    const queue = client.queues.get(message.author.id) || [];
    const total = queue.length;
    client.queues.set(message.author.id, []);
    message.reply(`🗑️ Queue dibersihkan. ${total} lagu dihapus.`);
  }
};
