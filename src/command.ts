import {
    CommandInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js"
import { ImportantStuff } from "."

export interface Command {
    name: string
    permission: Permission
    description: string
    category: string
    slashCommandBuilder: RESTPostAPIChatInputApplicationCommandsJSONBody
    execute:
        | ((imstuff: ImportantStuff, message: any, args: any) => void)
        | undefined
    slash(imstuff: ImportantStuff, interaction: CommandInteraction): void
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
