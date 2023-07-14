import { Interaction } from "discord.js"
import { ClassicClient } from ".."

module.exports = async (client: ClassicClient, interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return
    const command = client.commandLoader.getCommand(interaction.commandName)
    if (command) command.slash(client, interaction)
}
