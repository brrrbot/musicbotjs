const { EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports.loop = async function loop(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue) return void interaction.followUp({ content: `❌ | There no queue to loop` });
    // loop queue and send confirmation
    if (queue.repeatMode === QueueRepeatMode.QUEUE) {
        queue.setRepeatMode(QueueRepeatMode.OFF);
        await interaction.followUp(`✅ | Loop queue has been disabled!`);
    } else {
        queue.setRepeatMode(QueueRepeatMode.QUEUE);
        await interaction.followUp(`✅ | Loop queue has been enabled!`);
    }
}

module.exports.pause = async function pause(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue) return void interaction.followUp({ content: `There is no song to pause/resume` });

    queue.node.setPaused(!queue.node.isPaused());
    await interaction.followUp("(o^-')b");
}

module.exports.prev = async function prev(interaction) {
    const queue = useQueue(interaction.guildId);
    // check for queue
    if (!queue) return void interaction.followUp({ content: `❌ | This server currently does not have a queue` });
    // check for previous track
    if (!queue.history.previousTrack) return void interaction.followUp({ content: `There is no previous song` });
    // go to previous song
    queue.history.previous(true);
    // send confirmation
    await interaction.followUp(`✅ | returning to previous song...`);
}

module.exports.viewQueue = async function viewQueue(interaction) {
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

module.exports.repeat = async function repeat(interaction) {
    const queue = useQueue(interaction.guildId);
    // check for queue
    if (!queue) return void interaction.followUp({ content: `❌ | This server currently does not have a queue` });
    // loop queue and send confirmation
    if (queue.repeatMode === QueueRepeatMode.TRACK) {
        queue.setRepeatMode(QueueRepeatMode.OFF);
        await interaction.followUp(`✅ | Loop song has been disabled!`);
    } else {
        queue.setRepeatMode(QueueRepeatMode.TRACK);
        await interaction.followUp(`✅ | Loop song has been enabled!`);
    }
}

module.exports.shuffle = async function shuffle(interaction) {
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

module.exports.skip = async function skip(interaction) {
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

module.exports.stop = async function stop(interaction) {
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

module.exports.youtubeAutoplay = async function youtubeAutoplay(interaction) {
    const queue = useQueue(interaction.guildId);
    // check for queue
    if (!queue) return void interaction.followUp({ content: `❌ | This server currently does not have a queue` });
    // toggle autoplay and send confirmation
    if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
        queue.setRepeatMode(QueueRepeatMode.OFF);
        await interaction.followUp(`✅ | Autoplay has been disabled!`);
    } else {
        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
        await interaction.followUp(`✅ | Autoplay has been enabled!`);
    }
}