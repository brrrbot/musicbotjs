const { EmbedBuilder } = require("discord.js");
const { searchPlaylist } = require("./searchPlaylist");

async function playPlaylist(interaction, player) {
    const query = interaction.options.get("query")?.value;
    const searchResult = await searchPlaylist(query, interaction, player);

    if (!searchResult || !searchResult.tracks.length) {
        return void interaction.followUp({ content: "No results were found!" });
    }

    let queue = player.nodes.get(interaction.guild);
    if (!queue) {
        queue = await player.nodes.create(interaction.guild, { metadata: interaction.channel });
    }
    queue.addTrack(searchResult.playlist);

    try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
        void player.destroy();
        return void interaction.followUp({ content: "Could not join voice channel!" });
    }

    const playlist = searchResult.playlist;
    const embed = new EmbedBuilder()
        .setColor(0x1db954)
        .setAuthor({ name: '📂 Playlist Added to Queue', iconURL: playlist.thumbnail })
        .setTitle(playlist.title)
        .setURL(playlist.url)
        .setThumbnail(playlist.thumbnail)
        .addFields(
            { name: 'Tracks Added', value: `${playlist.tracks.length} songs`, inline: true },
            {
                name: 'Requested by',
                value: playlist.tracks[0]?.requestedBy?.username || 'Unknown',
                inline: true,
            }
        )
    await interaction.followUp({ embeds: [embed] });

    if (!queue.isPlaying()) {
        await queue.node.play();
    }
}

module.exports = { playPlaylist };
