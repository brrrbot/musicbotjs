const { EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

async function stop(interaction) {
    const queue = useQueue(interaction.guildId); // get current queue
    if (!queue) {
        return void interaction.followUp({ content: "Bot is already inactive" });
    }
    queue.delete(); // deletes the queue

    const embed = new EmbedBuilder()
        .setColor(0x1db954)
        .setDescription("Music player is stopped")
        .setFooter({ text: "why you bully me?🥺" });
    await interaction.followUp({ embeds: [embed] });
}

module.exports = { stop };
