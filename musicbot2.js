// Import dotenv
require('dotenv').config();

// Import functions from discordjs
const {
    Client,
    IntentsBitField,
    GuildMember,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require('discord.js');

// Import functions from discord-player
const {
    Player,
} = require('discord-player');

// Import Extractors
// const { SpotifyExtractor } = require('discord-player-spotify')
const { YoutubeiExtractor } = require('discord-player-youtubei');

// Import utils
const { playSong, playPlaylist } = require('./utils/youtubeCommands');
const { playSpotifySong, playSpotifyPlaylist } = require('./utils/spotifyCommands');
const { stop, skip, pause, youtubeAutoplay, viewQueue, loop, repeat, prev, shuffle } = require('./utils/commands');

// Setup client
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
});

// Initialize Music Player
const player = new Player(client);

// Register extractors
player.extractors.register(YoutubeiExtractor, {
    streamOptions: {
        useClient: "WEB",
    },
    generateWithPoToken: true,
    useServerAbrStream: true,
});
// player.extractors.register(SpotifyExtractor, {});

// Bot status
client.on('ready', () => {
    console.log("Bot is online!");

    // custom constant changing discord status
    const activities = [
        "up and running ( ˶ˆᗜˆ˵ )",
        "happy with spotify access ♡⸜(˶˃ ᵕ ˂˶)⸝♡",
        "waiting for non-existent update patch",
        "fantasizing about the money earn from being a music bot (,,>ヮ<,,)!",
        "🎶🎶🎶",
        "better than matchbox",
        "better than jockie music"
    ];
    setInterval(() => {
        const status = activities[Math.floor(Math.random() * activities.length)];
        client.user.setPresence({ activities: [{ name: `${status}` }] });
    }, 5000);
});

// COMMAND HANDLILNG
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return; // ignore if not command

    // drop command if not in voice channel
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) { return void interaction.reply({ content: "You are not in a voice channel!", ephemeral: true }) }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) { return void interaction.reply({ content: "You are not in my voice channel!", ephemeral: true }) }

    // YOUTUBE COMMANDS
    if (interaction.commandName === "youtube") {
        await interaction.deferReply();
        playSong(interaction, player)
    }

    if (interaction.commandName === "youtube-playlist") {
        await interaction.deferReply();
        playPlaylist(interaction, player)
    }

    // SPOTIFY COMMAND
    if (interaction.commandName === "spotify") {
        await interaction.deferReply();
        playSpotifySong(interaction, player);
    }

    if (interaction.commandName === "spotify-playlist") {
        await interaction.deferReply();
        playSpotifyPlaylist(interaction, player);
    }

    // BOT COMMANDS
    if (interaction.commandName === "stop") {
        await interaction.deferReply();
        stop(interaction);
    }
});

// Emitted when the player starts to play a song
player.events.on('playerStart', (queue, track) => {
    let embed = new EmbedBuilder();
    embed
        .setColor(0x1db954)
        .setAuthor({
            name: 'Now Playing 🎶',
            iconURL: track.thumbnail
        })
        .setTitle(track.title)
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .addFields(
            { name: 'Duration', value: track.duration, inline: true },
            { name: 'Requested by', value: track.requestedBy?.username || 'Unknown', inline: true },
        )
        .setFooter({
            text: 'Enjoy your music!',
            iconURL: 'https://cdn-icons-png.flaticon.com/128/9280/9280598.png'
        })
    // send current song playing along
    queue.metadata.send({ embeds: [embed], components: [playerButtons, playerButtons2] });
});

// ACTION ROW BUTTONS
const playerButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('⏮️ Prev')
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId('pause')
        .setLabel('⏯ Pause/Play')
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('⏭️ Next')
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('⛔ Stop')
        .setStyle(ButtonStyle.Danger)
);
const playerButtons2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId('repeat')
        .setLabel('🔂 Loop Song')
        .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
        .setCustomId('loop')
        .setLabel('🔁 Loop Queue')
        .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
        .setCustomId('shuffle')
        .setLabel('🔀 Shuffle')
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId('autoplay')
        .setLabel('▶️ AutoPlay')
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId('queue')
        .setLabel('📄 Queue')
        .setStyle(ButtonStyle.Secondary)
);


// ACTION ROW BUTTONS COMMANDS
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    // drop command if not in voice channel
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) { return void interaction.reply({ content: "You are not in a voice channel!", ephemeral: true }) }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) { return void interaction.reply({ content: "You are not in my voice channel!", ephemeral: true }) }

    // SKIP SONG COMMAND
    if (interaction.customId === "skip") {
        await interaction.deferReply();
        skip(interaction);
    }

    // PAUSE OR RESUME COMMAND
    if (interaction.customId === "pause") {
        await interaction.deferReply();
        pause(interaction);
    }

    // VIEW QUEUE COMMAND
    if (interaction.customId === "queue") {
        await interaction.deferReply();
        viewQueue(interaction);
    }

    // LOOP QUEUE COMMAND
    if (interaction.customId === "loop") {
        await interaction.deferReply();
        loop(interaction);
    }

    // REPEAT TRACK COMMAND
    if (interaction.customId === "repeat") {
        await interaction.deferReply();
        repeat(interaction);
    }

    // PREV TRACK COMMAND
    if (interaction.customId === "prev") {
        await interaction.deferReply();
        prev(interaction);
    }

    // SHUFFLE QUEUE COMMAND
    if (interaction.customId === "shuffle") {
        await interaction.deferReply();
        shuffle(interaction);
    }

    // AUTOPLAY
    if (interaction.customId === "autoplay") {
        await interaction.deferReply();
        youtubeAutoplay(interaction);
    }

    // Stop Music Player
    if (interaction.customId === 'stop') {
        await interaction.deferReply();
        stop(interaction);
    }
});

// Error handling for queue-related issues
player.events.on('error', (queue, error) => {
    try {
        console.error(`[Error] Queue: ${queue.guild.name} | ${error.message}`);
        if (queue) {
            if (queue.tracks.length > 0) {
                console.log(`[Action] Attempting to play the next song in queue...`);
                queue.node.skip();
            } else {
                console.log(`[Action] No more tracks in queue. Destroying the queue...`);
                queue.delete();
            }
        }
    } catch (err) {
        console.error(`[Unhandled Error] ${err.message}`);
    }
});

// Error handling for player-related issues
player.events.on('playerError', (queue, error) => {
    try {
        console.error(`[Player Error] Guild: ${queue.guild.name} | Error: ${error.message}`);
        if (queue) {
            if (queue.tracks.length > 0) {
                console.log(`[Action] Attempting to play the next track after player error...`);
                queue.node.skip();
            } else {
                console.log(`[Action] No more tracks. Stopping and leaving the channel...`);
                queue.delete();
            }
        }
    } catch (err) {
        console.error(`[Unhandled Player Error] ${err.message}`);
    }
});

// Global error handling to prevent crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error(`[Unhandled Rejection] Promise: ${promise}, Reason: ${reason}`);
});

process.on('uncaughtException', (err) => {
    console.error(`[Uncaught Exception] ${err.message}`);
});

// DISCORD BOT LOGIN
client.login(process.env.TOKEN2);