import { Command } from "./command"
import {
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes
} from "discord.js"
import searchForFIles from "./utils/searchForFiles"
import { Config } from "."
import { ExternalCommand } from "./externalCommands"

export class CommandLoader {
    public token: string
    public clientId: string
    public guildId: string
    public staffGuildId: string
    public commands: Map<string, Command> = new Map()

    constructor(config: Config) {
        if (!process.env.TOKEN) throw new Error("No token provided")
        this.token = process.env.TOKEN

        this.clientId = config.clientId
        this.guildId = config.main.guildId
        this.staffGuildId = config.staff.guildId

        this.loadCommands().then(() => {
            console.log("Successfully loaded commands.")
            this.deployCommands()
        })
    }

    public getCommand(name: string): Command | undefined {
        return this.commands.get(name)
    }

    public async loadCommands(): Promise<void> {
        const files = searchForFIles("./commands")
        for (const file of files) {
            const command: Command = new (await import(file)).default()
            this.commands.set(command.name, command)
        }
    }

    public async deployCommands() {
        const rest = new REST().setToken(this.token)
        const cmds: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
        const global: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
        for (const command of this.commands.values()) {
            if (command.global) global.push(command.slashCommandBuilder)
            else cmds.push(command.slashCommandBuilder)
        }

        const extCmds: ExternalCommand[] = (await import("./externalCommands"))
            .default
        for (const command of extCmds) {
            if (command.global) global.push(command.slash)
            else cmds.push(command.slash)
        }

        rest.put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
            body: cmds
        }).then(() =>
            console.log(
                "Successfully registered main guild application commands."
            )
        )

        rest.put(
            Routes.applicationGuildCommands(this.clientId, this.staffGuildId),
            { body: cmds }
        ).then(() =>
            console.log(
                "Successfully registered staff guild application commands."
            )
        )

        rest.put(Routes.applicationCommands(this.clientId), {
            body: global
        }).then(() =>
            console.log("Successfully registered global application commands.")
        )
    }
}
