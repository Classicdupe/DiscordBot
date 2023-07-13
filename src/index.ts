import { Client, Collection, IntentsBitField } from "discord.js"
import { CommandLoader } from "./commandLoader"
import { Database } from "./database"
import { readFileSync } from "fs"
import dotenv from "dotenv"
import searchForFiles from "./utils/searchForFiles"

dotenv.config({
    path: "./../resources/.env"
})

const config: Config = JSON.parse(
    readFileSync("../resources/config.json", "utf-8")
)

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
}) as ClassicClient

client.commandLoader = new CommandLoader(config)
client.database = new Database(config)
client.config = config

searchForFiles("./events").forEach(async (file) => {
    const event = await import(file)
    const name = file.split("/").slice(-1).pop()?.split(".")[0]
    if (!name) return
    client.on(name, event.bind(null, client))
})

client.login(process.env.TOKEN)

export type ClassicClient = Client & {
    commandLoader: CommandLoader
    database: Database
    invites: Collection<string, number>
    config: Config
}

export type Config = {
    clientId: string
    staffIcon: string
    main: {
        guildId: string
        channels: {
            activity: string
            info: string
        }
    }
    database: DatabaseData
}

export type DatabaseData = {
    host: string
    username: string
    password: string
    database: string
}
