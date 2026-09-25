module.exports = {
  name: 'track',
  async execute(message, args, client) {
    const command = client.commands.get('search');
    return command.execute(message, args, client);
  }
};
