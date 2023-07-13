import { Command } from "./command"
import {
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes
} from "discord.js"
import searchForFIles from "./utils/searchForFiles"

export class CommandLoader {
    public token: string
    public clientId: string
    public guildId: string
    public commands: Map<string, Command> = new Map()

    constructor() {
        if (!process.env.TOKEN) throw new Error("No token provided")
        this.token = process.env.TOKEN

        if (!process.env.CLIENT_ID) throw new Error("No client id provided")
        this.clientId = process.env.CLIENT_ID

        if (!process.env.GUILD_ID) throw new Error("No guild id provided")
        this.guildId = process.env.GUILD_ID

        this.loadCommands()
        console.log("Loaded commands")
        this.deployCommands().then(() => console.log("Deployed commands"))
    }

    public getCommand(name: string): Command | undefined {
        return this.commands.get(name)
    }

    public loadCommands() {
        searchForFIles("./commands").forEach(async (file: string) => {
            const command: Command = new (await import(file)).default()
            this.commands.set(command.name, command)
        })
    }

    public async deployCommands() {
        const rest = new REST().setToken(this.token)
        const cmds: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
        for (const command of this.commands.values())
            cmds.push(command.slashCommandBuilder)
        await rest.put(
            Routes.applicationGuildCommands(this.clientId, this.guildId),
            { body: cmds }
        )
    }
}
