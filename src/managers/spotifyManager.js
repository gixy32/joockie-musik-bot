const axios = require('axios');
const querystring = require('querystring');

class SpotifyManager {
  static accessToken = null;
  static tokenExpiry = null;

  static async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
        logger.warn('Spotify credentials not provided. Some features will be limited.');
        return null;
      }

      const credentials = Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64');

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        querystring.stringify({ grant_type: 'client_credentials' }),
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;
      return this.accessToken;
    } catch (error) {
      logger.error('Spotify auth error:', error.message);
      return null;
    }
  }

  static async searchSpotify(query) {
    try {
      const token = await this.getAccessToken();
      if (!token) return null;

      // Check if query is a Spotify link
      const spotifyLinkMatch = query.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
      let trackId;

      if (spotifyLinkMatch) {
        trackId = spotifyLinkMatch[1];
      } else {
        // Search for track
        const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
          params: {
            q: query,
            type: 'track',
            limit: 1
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!searchResponse.data.tracks.items.length) return null;
        trackId = searchResponse.data.tracks.items[0].id;
      }

      // Get track details
      const trackResponse = await axios.get(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const track = trackResponse.data;
      const durationInSec = Math.floor(track.duration_ms / 1000);

      return {
        title: track.name,
        artist: track.artists[0].name,
        url: track.external_urls.spotify,
        thumbnail: track.album.images[0]?.url,
        duration: this.formatDuration(durationInSec),
        durationInSec: durationInSec,
        isrc: track.external_ids.isrc,
        source: 'spotify',
        spotifyId: trackId,
        album: track.album.name
      };
    } catch (error) {
      logger.error('Spotify search error:', error.message);
      return null;
    }
  }

  static formatDuration(seconds) {
    if (!seconds || Number.isNaN(seconds)) return 'Unknown';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }
}

module.exports = SpotifyManager;
