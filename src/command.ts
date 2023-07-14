import {
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    CommandInteraction,
    Message,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js"
import { ClassicClient } from "."

export type Command = {
    name: string
    permission: Permission
    description: string
    category: string
    global: boolean
    slashCommandBuilder: RESTPostAPIChatInputApplicationCommandsJSONBody
    execute:
        | ((
              client: ClassicClient,
              message: Message,
              command: string,
              args: string[]
          ) => void)
        | undefined
    slash(client: ClassicClient, interaction: ChatInputCommandInteraction): void
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
