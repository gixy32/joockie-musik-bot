const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  async execute(message, args, client) {
    const p = client.config.prefix;
    const embed = new EmbedBuilder()
      .setColor('#1DB954')
      .setTitle('🎵 Joockie Musik')
      .setDescription('Spotify search, metadata, dan personal queue. Audio full tetap diputar melalui aplikasi Spotify resmi.')
      .addFields(
        { name: 'Spotify', value: `\`${p}search <judul>\`\n\`${p}add <judul>\`\n\`${p}play\`\n\`${p}np\`` },
        { name: 'Queue', value: `\`${p}queue\`\n\`${p}remove <nomor>\`\n\`${p}clear\`` },
        { name: 'Info', value: `\`${p}track <judul>\`\n\`${p}ping\`\n\`${p}help\`` }
      );
    return message.reply({ embeds: [embed] });
  }
};
