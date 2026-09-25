const SpotifyWebApi = require('spotify-web-api-node');

class SpotifyManager {
  constructor(logger) {
    this.logger = logger;
    this.api = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    });
    this.expiresAt = 0;
  }

  async token() {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error('SPOTIFY_CLIENT_ID atau SPOTIFY_CLIENT_SECRET belum diisi');
    }
    if (Date.now() < this.expiresAt) return;
    const result = await this.api.clientCredentialsGrant();
    this.api.setAccessToken(result.body.access_token);
    this.expiresAt = Date.now() + (result.body.expires_in - 60) * 1000;
  }

  async searchTrack(query) {
    await this.token();
    const result = await this.api.searchTracks(query, { limit: 1 });
    const track = result.body.tracks.items[0];
    if (!track) return null;
    return this.formatTrack(track);
  }

  formatTrack(track) {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album?.name || 'Unknown',
      image: track.album?.images?.[0]?.url,
      url: track.external_urls.spotify,
      duration: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor(track.duration_ms / 1000) % 60).padStart(2, '0')}`,
      popularity: track.popularity,
      releaseDate: track.album?.release_date || 'N/A'
    };
  }
}
module.exports = SpotifyManager;
