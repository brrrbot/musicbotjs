const { QueryType } = require("discord-player");

async function searchSpotifyPlaylist(query, interaction, player) {
    try {
        const result = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.SPOTIFY_PLAYLIST,
        });
        return result;
    } catch (error) {
        console.error("Error while searching for Spotify Playlist: ", error);
        return null;
    }
}

module.exports = { searchSpotifyPlaylist };
