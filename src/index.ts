import { Client, Collection, IntentsBitField } from "discord.js"
import { CommandLoader } from "./commandLoader"
import { Database } from "./database"
import { config } from "dotenv"
import searchForFiles from "./utils/searchForFiles"

config({
    path: "./../resources/.env"
})

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

client.commandLoader = new CommandLoader()
client.database = new Database()
client.staffIconUrl =
    "https://cdn.discordapp.com/attachments/1068991910380839075/1128878013031923864/StaffLogo.png"

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
    staffIconUrl: string
    invites: Collection<string, number>
}
