const { useQueue } = require("discord-player");

async function prev(interaction) {
    const queue = useQueue(interaction.guildId);
    // check for queue
    if (!queue) return void interaction.followUp({ content: `❌ | This server currently does not have a queue` });
    // check for previous track
    if (!queue.history.previousTrack) return void interaction.followUp({ content: `There is no previous song` });
    // go to previous song
    queue.history.previous(true);
    // send confirmation
    await interaction.followUp(`✅ | returning to previous song...`);
}

module.exports = { prev }