const { EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

async function viewQueue(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue || !queue.currentTrack) return interaction.followUp({ content: `❌ | There's no queue to display.` });

    const queueString = queue.tracks
        .map((song, i) => `\`${i + 1}.\` [${song.title}] \`[${song.duration}]\` — ${song.requestedBy.displayName}`)
        .join("\n");

    const embed = new EmbedBuilder()
        .setColor(0x1DB954)
        .setTitle("🎶 Current Queue")
        .setThumbnail(queue.currentTrack.thumbnail)
        .setDescription(
            `**▶️ Now Playing:**\n[${queue.currentTrack.title}] \`[${queue.currentTrack.duration}]\`\n` +
            `Requested by: **${queue.currentTrack.requestedBy.displayName}**\n\n` +
            (queue.getSize() > 0 ? `**📜 Up Next:**\n${queueString}` : `✅ Queue is empty.`)
        )
        .setFooter({ text: `${queue.getSize()} total song${queue.getSize() > 1 ? "s" : ""} in queue` });

    await interaction.followUp({ embeds: [embed] });
}

module.exports = { viewQueue };