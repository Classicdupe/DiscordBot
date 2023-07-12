import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import { Command, Permission } from "../../command"
import { ImportantStuff } from "../.."

export default class PingCommand implements Command {
    name = "ping"
    permission = Permission.Default
    description = "To ping the bot!"
    category = "general"
    slashCommandBuilder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .toJSON()
    execute(message: any, args: any) {
        message.reply("Pong!")
    }
    slash(imstuff: ImportantStuff, interaction: CommandInteraction) {
        interaction.reply("Pong!")
    }
}
