import { Client, IntentsBitField, Message } from "discord.js"
import { CommandLoader } from "./commandLoader"
import { Database } from "./database";
import { config } from "dotenv";
import searchForFiles from "./utils/searchForFiles";

config({
    path: "./../resources/.env"
})

let clientBuilder: any = new Client({
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

clientBuilder.commandLoader = new CommandLoader()
clientBuilder.database = new Database()

const client: ClassicClient = clientBuilder

searchForFiles("./events").forEach((file) => {
    const event = require(file)
    const name = file.split('/').slice(-1).pop()?.split('.')[0]
    if(!name) return
    client.on(name, event.bind(null, client))
})

client.login(process.env.TOKEN)

export interface ClassicClient extends Client {
    commandLoader: CommandLoader
    database: Database
}