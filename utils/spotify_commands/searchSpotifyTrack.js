const { QueryType } = require("discord-player");

async function searchSpotifyTrack(query, interaction, player) {
    try {
        const result = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.SPOTIFY_SONG,
        });
        return result;
    } catch (error) {
        console.error("Error while searching Spotify Song: ", error);
        return null;
    }
}

module.exports = { searchSpotifyTrack };
