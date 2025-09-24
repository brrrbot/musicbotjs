const { useQueue } = require("discord-player");

async function shuffle(interaction) {
    const queue = useQueue(interaction.guildId);
    // check for queue
    if (!queue) return void interaction.followUp({ content: `❌ | No queue to shuffle` });
    // shuffle queue
    if (queue.isShuffling) {
        queue.disableShuffle();
        await interaction.followUp(`✅ | shuffling is disabled`);
    } else {
        queue.enableShuffle();
        await interaction.followUp(`✅ | shuffling is enabled`);
    }
}

module.exports = { shuffle };