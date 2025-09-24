const { useQueue } = require("discord-player");

async function loop(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue) return void interaction.followUp({ content: `❌ | There no queue to loop` });
    // loop queue and send confirmation
    if (queue.repeatMode === QueueRepeatMode.QUEUE) {
        queue.setRepeatMode(QueueRepeatMode.OFF);
        await interaction.followUp(`✅ | Loop queue has been disabled!`);
    } else {
        queue.setRepeatMode(QueueRepeatMode.QUEUE);
        await interaction.followUp(`✅ | Loop queue has been enabled!`);
    }
}

module.exports = { loop };