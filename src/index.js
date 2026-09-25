require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const Logger = require('./utils/logger');
const SpotifyManager = require('./managers/spotifyManager');

const logger = new Logger();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.config = {
  prefix: process.env.PREFIX || '!',
  queueLimit: Number(process.env.QUEUE_LIMIT || 100)
};
client.commands = new Collection();
client.queues = new Map();
client.spotify = new SpotifyManager(logger);

const commandsDir = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsDir, file));
  if (command.name && typeof command.execute === 'function') {
    client.commands.set(command.name, command);
  }
}

client.once('ready', () => {
  logger.info(`Bot online sebagai ${client.user.tag}`);
  client.user.setActivity('Spotify metadata | !help', { type: 0 });
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(client.config.prefix)) return;

  const parts = message.content.slice(client.config.prefix.length).trim().split(/\s+/);
  const name = (parts.shift() || '').toLowerCase();
  const command = client.commands.get(name);
  if (!command) return;

  try {
    await command.execute(message, parts, client);
  } catch (error) {
    logger.error(`${name}: ${error.message}`);
    await message.reply('❌ Terjadi kesalahan saat menjalankan command.');
  }
});

if (!process.env.TOKEN) {
  logger.error('TOKEN belum diisi di file .env');
  process.exit(1);
}

client.login(process.env.TOKEN);
