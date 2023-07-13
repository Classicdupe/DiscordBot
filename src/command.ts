import {
    Client,
    CommandInteraction,
    Message,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js"
import { Database } from "./database"
import { ClassicClient } from "."

export interface Command {
    name: string
    permission: Permission
    description: string
    category: string
    slashCommandBuilder: RESTPostAPIChatInputApplicationCommandsJSONBody
    execute:
        | ((client: ClassicClient, message: Message, command: any, args: any) => void)
        | undefined
    slash(client: ClassicClient, interaction: CommandInteraction): void
}

export enum Permission {
    Default,
    Vip,
    Mvp,
    Legend,
    Mod,
    Dev,
    Admin
}
