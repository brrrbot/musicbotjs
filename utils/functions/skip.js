const { EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

async function skip(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue) return void interaction.followUp({ content: `❌ | There is no song to skip in queue` });

    const currentSong = queue.currentTrack;
    queue.node.skip();

    const embed = new EmbedBuilder()
        .setColor(0x1db954)
        .setDescription(`Skipped **${currentSong.title}**`)
        .setThumbnail(currentSong.thumbnail);
    await interaction.followUp({ embeds: [embed] });
}

module.exports = { skip };