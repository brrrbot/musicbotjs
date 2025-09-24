const { EmbedBuilder } = require('discord.js');
const { searchTrack } = require('./searchTracks');

async function playSong(interaction, player) {
    const query = interaction.options.get("query")?.value;
    const searchResult = await searchTrack(query, interaction, player);

    if (!searchResult || !searchResult.tracks.length) {
        return void interaction.followUp({ content: "No results found!" });
    }

    let queue = player.nodes.get(interaction.guild); // get queue in channel
    if (!queue) {
        queue = await player.nodes.create(interaction.guild, { metadata: interaction.channel });
    }
    queue.addTrack(searchResult.tracks[0]); // Add song to queue

    // Join voice channel
    try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
        void player.destroy();
        return void interaction.followUp({ content: "Could not join voice channel!" });
    }

    // Display song queued
    const track = searchResult.tracks[0];
    let embed = new EmbedBuilder()
        .setColor(0x1db954)
        .setAuthor({
            name: '🎵 Track Added to Queue',
            iconURL: track.thumbnail,
        })
        .setTitle(track.title)
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .addFields(
            { name: 'Duration', value: track.duration, inline: true },
            { name: 'Requested by', value: track.requestedBy?.username || 'Unknown', inline: true },
        )
    await interaction.followUp({ embeds: [embed] });

    // Play the queue
    if (!queue.isPlaying()) {
        await queue.node.play();
    }
}

module.exports = { playSong };