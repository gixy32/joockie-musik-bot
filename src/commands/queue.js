const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'queue',
  async execute(message, args, client) {
    const queue = client.queues.get(message.author.id) || [];
    if (!queue.length) return message.reply(`Queue kosong. Gunakan ${client.config.prefix}add <judul>.`);
    const text = queue.map((t, i) => `${i + 1}. [${t.title}](${t.url}) — ${t.artist}`).join('\n');
    return message.reply({ embeds: [new EmbedBuilder().setColor('#1DB954').setTitle(`🎶 Queue (${queue.length})`).setDescription(text)] });
  }
};
