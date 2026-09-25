const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'add',
  async execute(message, args, client) {
    if (!args.length) return message.reply(`Format: ${client.config.prefix}add <judul lagu>`);
    const track = await client.spotify.searchTrack(args.join(' '));
    if (!track) return message.reply('❌ Lagu tidak ditemukan di Spotify.');
    const queue = client.queues.get(message.author.id) || [];
    if (queue.length >= client.config.queueLimit) return message.reply('❌ Queue sudah penuh.');
    queue.push(track);
    client.queues.set(message.author.id, queue);
    const embed = new EmbedBuilder().setColor('#1DB954').setTitle('✅ Added to Queue').setDescription(`[${track.title}](${track.url})`).setThumbnail(track.image).addFields(
      { name: 'Artist', value: track.artist, inline: true },
      { name: 'Position', value: `#${queue.length}`, inline: true }
    );
    return message.reply({ embeds: [embed] });
  }
};
