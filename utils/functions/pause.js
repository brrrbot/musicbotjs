const { useQueue } = require("discord-player");

async function pause(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue) return void interaction.followUp({ content: `There is no song to pause/resume` });

    queue.node.setPaused(!queue.node.isPaused());
    await interaction.followUp("(o^-')b");
}

module.exports = { pause };
