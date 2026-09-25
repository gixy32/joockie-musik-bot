const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'search',
  async execute(message, args, client) {
    if (!args.length) return message.reply(`Format: ${client.config.prefix}search <judul lagu>`);
    const track = await client.spotify.searchTrack(args.join(' '));
    if (!track) return message.reply('❌ Lagu tidak ditemukan di Spotify.');
    const embed = new EmbedBuilder().setColor('#1DB954').setTitle('🔍 Search Result').setDescription(`[${track.title}](${track.url})`).setThumbnail(track.image).addFields(
      { name: 'Artist', value: track.artist, inline: true },
      { name: 'Album', value: track.album, inline: true },
      { name: 'Duration', value: track.duration, inline: true },
      { name: 'Release', value: track.releaseDate, inline: true },
      { name: 'Popularity', value: `${track.popularity}/100`, inline: true }
    ).setFooter({ text: 'Klik judul untuk membuka Spotify' });
    return message.reply({ embeds: [embed] });
  }
};
