// playSpotifyTrack.js
const { EmbedBuilder } = require("discord.js");
const { searchSpotifyTrack } = require("./searchSpotifyTrack");

async function playSpotifySong(interaction, player) {
    const query = interaction.options.get("query")?.value;
    const searchResult = await searchSpotifyTrack(query, interaction, player);

    if (!searchResult || !searchResult.tracks.length) {
        return void interaction.followUp({ content: "No results were found!" });
    }

    let queue = player.nodes.get(interaction.guild);
    if (!queue) {
        queue = await player.nodes.create(interaction.guild, { metadata: interaction.channel });
    }
    queue.addTrack(searchResult.tracks[0]);

    try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
        void player.destroy();
        return void interaction.followUp({ content: "Could not join voice channel!" });
    }

    const track = searchResult.tracks[0];
    const embed = new EmbedBuilder()
        .setColor(0x1DB954)
        .setAuthor({ name: '🎧 Spotify Track Added', iconURL: track.thumbnail })
        .setTitle(track.title)
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .addFields(
            { name: 'Duration', value: track.duration, inline: true },
            { name: 'Requested by', value: track.requestedBy?.username || 'Unknown', inline: true }
        )
    await interaction.followUp({ embeds: [embed] });

    if (!queue.isPlaying()) {
        await queue.node.play();
    }
}

module.exports = { playSpotifySong };
