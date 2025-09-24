const { QueryType } = require("discord-player");

async function searchPlaylist(query, interaction, player) {
    try {
        const searchResult = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_PLAYLIST,
        });
        return searchResult;
    } catch (error) {
        console.error("Error while searching for Youtube Playlist: ", error);
        return null;
    }
}

module.exports = { searchPlaylist };
