import { CommandInteraction, Message, SlashCommandBuilder } from "discord.js"
import { Command, Permission } from "../../command"
import { ClassicClient } from "../.."

export default class LeaveCommand implements Command {
    name = "leave"
    permission = Permission.Default
    description = "To leave the channel the bot is in"
    category = "general"
    global = true
    slashCommandBuilder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .toJSON()
    execute(client: ClassicClient, message: Message) {
        const musicPlayer = client.musicPlayers.get(message.guildId as string)
        if (!musicPlayer)
            return message.reply({
                content: "I'm not in a voice channel"
            })
        musicPlayer.destroy()
        message.reply({
            content: "Left the voice channel"
        })
    }
    slash(client: ClassicClient, interaction: CommandInteraction) {
        const musicPlayer = client.musicPlayers.get(
            interaction.guildId as string
        )
        if (!musicPlayer)
            return interaction.reply({
                content: "I'm not in a voice channel",
                ephemeral: true
            })
        musicPlayer.destroy()
        interaction.reply({
            content: "Left the voice channel"
        })
    }
}
