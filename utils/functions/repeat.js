const { useQueue } = require("discord-player");

async function repeat(interaction) {
    const queue = useQueue(interaction.guildId);
    // check for queue
    if (!queue) return void interaction.followUp({ content: `❌ | This server currently does not have a queue` });
    // loop queue and send confirmation
    if (queue.repeatMode === QueueRepeatMode.TRACK) {
        queue.setRepeatMode(QueueRepeatMode.OFF);
        await interaction.followUp(`✅ | Loop song has been disabled!`);
    } else {
        queue.setRepeatMode(QueueRepeatMode.TRACK);
        await interaction.followUp(`✅ | Loop song has been enabled!`);
    }
}

module.exports = { repeat };