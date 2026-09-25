const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'play',
  async execute(message, args, client) {
    const queue = client.queues.get(message.author.id) || [];
    if (!queue.length) return message.reply(`Queue kosong. Gunakan ${client.config.prefix}add <judul>.`);
    const track = queue[0];
    return message.reply({ embeds: [new EmbedBuilder().setColor('#1DB954').setTitle('▶️ Started playing').setDescription(`[${track.title}](${track.url}) by **${track.artist}**`).setThumbnail(track.image).addFields(
      { name: 'Album', value: track.album, inline: true },
      { name: 'Duration', value: track.duration, inline: true },
      { name: 'Request by', value: message.author.tag, inline: true },
      { name: 'Listen', value: `[Open in Spotify](${track.url})`, inline: false }
    ).setFooter({ text: `Queue: ${queue.length} lagu` })] });
  }
};
