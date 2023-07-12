import { Client, IntentsBitField, Message } from "discord.js"
import { CommandLoader } from "./commandLoader"
import { Database } from "./database";
import { config } from "dotenv";

config({
    path: "./../resources/.env"
})

const database = new Database()

const client = new Client({
    intents: [
        IntentsBitField.Flags.AutoModerationConfiguration,
        IntentsBitField.Flags.AutoModerationExecution,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.DirectMessageTyping,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildInvites,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent
    ]
})

const commandLoader = new CommandLoader()

const importantStuff: ImportantStuff = {
    bot: client,
    database: database
}

client.on("ready", () => {
    console.log("Discord bot is now online")
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return
    const command = commandLoader.getCommand(interaction.commandName)
    if (command) command.slash(importantStuff, interaction)
})

client.on("messageCreate", async (msg: Message) => {
    if (msg.author.bot) return
    if (!msg.content.startsWith("!")) return
    const cmd = msg.content.slice(1).trim().split(/ +/g)[0]
    const args = msg.content.slice(1).trim().split(/ +/g).slice(1)

    const command = commandLoader.getCommand(cmd)
    if (command && command.execute != undefined)
        command.execute(importantStuff, msg, args)
})

client.login(process.env.TOKEN).then(() =>
    console.log("ClassicDupe Application bot is now online")
)

export interface ImportantStuff {
    bot: Client
    database: Database
}