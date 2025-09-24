const { useQueue } = require("discord-player");

async function youtubeAutoplay(interaction) {
    const queue = useQueue(interaction.guildId);
    // check for queue
    if (!queue) return void interaction.followUp({ content: `❌ | This server currently does not have a queue` });
    // toggle autoplay and send confirmation
    if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
        queue.setRepeatMode(QueueRepeatMode.OFF);
        await interaction.followUp(`✅ | Autoplay has been disabled!`);
    } else {
        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
        await interaction.followUp(`✅ | Autoplay has been enabled!`);
    }
}

module.exports = { youtubeAutoplay };