const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

async function searchSpotifyTrack(query, interaction, player) {
    try {
        const result = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.SPOTIFY_SONG,
        });
        return result;
    } catch (error) {
        console.error("Error while searching Spotify Song: ", error);
        return null;
    }
}

async function searchSpotifyPlaylist(query, interaction, player) {
    try {
        const result = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.SPOTIFY_PLAYLIST,
        });
        return result;
    } catch (error) {
        console.error("Error while searching for Spotify Playlist: ", error);
        return null;
    }
}

module.exports.playSpotifySong = async function playSpotifySong(interaction, player) {
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

module.exports.playSpotifyPlaylist = async function playSpotifyPlaylist(interaction, player) {
    const query = interaction.options.get("query")?.value;
    const searchResult = await searchSpotifyPlaylist(query, interaction, player);

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
        .setColor(0x1DB954)
        .setAuthor({ name: '📂 Spotify Playlist Added', iconURL: playlist.thumbnail })
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
        );
    await interaction.followUp({ embeds: [embed] });

    if (!queue.isPlaying()) {
        await queue.node.play();
    }
}