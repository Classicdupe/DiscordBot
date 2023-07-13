import { Client, CommandInteraction, Message, SlashCommandBuilder } from "discord.js"
import { Command, Permission } from "../../command"
import { ClassicClient } from "../.."

export default class PingCommand implements Command {
    name = "ping"
    permission = Permission.Default
    description = "To ping the bot!"
    category = "general"
    slashCommandBuilder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .toJSON()
    execute(client: ClassicClient, message: Message, command: any, args: any) {
        message.reply("Pong!")
    }
    slash(client: ClassicClient, interaction: CommandInteraction) {
        interaction.reply("Pong!")
    }
}
