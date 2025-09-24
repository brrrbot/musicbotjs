// Imports
require('dotenv').config();
const { REST, Routes, Options } = require('discord.js');

// Array of musicbot commands
const commands = [
    {
        name: "youtube",
        description: "Plays a given song from youtube",
        options: [{
            name: "query",
            type: 3,
            description: "enter song name",
            required: true,
        }],
    },
    {
        name: "spotify",
        description: "Plays a given song from spotify",
        options: [{
            name: "query",
            type: 3,
            description: "copy-paste song url",
            required: true,
        }],
    },
    {
        name: "youtube-playlist",
        description: "Plays a given playlist from youtube",
        options: [{
            name: "query",
            type: 3,
            description: "copy-paste playlist url",
            required: true,
        }],
    },
    {
        name: "spotify-playlist",
        description: "Plays a given playlist from spotify",
        options: [{
            name: "query",
            type: 3,
            description: "copy-paste playlist url",
            required: true,
        }],
    },
    {
        name: "stop",
        description: "Stop the music player (please don't👉 👈 🥺)",
    },
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN2);

// Register slash commands in discord
(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID2, process.env.GUILD_ID), { body: commands }
        );
        console.log('Slash commands were registered successfully!');
    } catch (error) {
        console.log(`ERROR... \n ${error}`)
    }
})();