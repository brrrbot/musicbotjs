const { QueryType } = require('discord-player');

async function searchTrack(query, interaction, player) {
    try {
        const searchResult = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE,
        });
        return searchResult;
    } catch (error) {
        console.error("Error while searching for Youtube Song: ", error);
        return null;
    }
}

module.exports = { searchTrack };