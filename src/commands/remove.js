module.exports = {
  name: 'remove',
  async execute(message, args, client) {
    const queue = client.queues.get(message.author.id) || [];
    const index = Number(args[0]) - 1;
    if (!Number.isInteger(index) || index < 0 || index >= queue.length) return message.reply(`Format: ${client.config.prefix}remove <nomor queue>`);
    const removed = queue.splice(index, 1)[0];
    message.reply(`🗑️ **${removed.title}** dihapus dari queue.`);
  }
};
