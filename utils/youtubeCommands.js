const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

async function searchTrack(query, interaction, player) {
    try {
        const searchResult = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE,
        });
        return searchResult;
    } catch (error) {
        console.error("Error while searching for Youtube Song: ", error);
        return null;
    }
}

async function searchPlaylist(query, interaction, player) {
    try {
        const searchResult = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_PLAYLIST,
        });
        return searchResult;
    } catch (error) {
        console.error("Error while searching for Youtube Playlist: ", error);
        return null;
    }
}

module.exports.playSong = async function playSong(interaction, player) {
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

module.exports.playPlaylist = async function playPlaylist(interaction, player) {
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