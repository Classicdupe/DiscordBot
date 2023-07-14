import {
    CommandInteraction,
    EmbedBuilder,
    Message,
    SlashCommandBuilder
} from "discord.js"
import { Command, Permission } from "../../command"
import { ClassicClient } from "../.."

export default class GlobalInvite implements Command {
    name = "globalinvite"
    permission = Permission.Default
    description = "To get the global invite link"
    category = "general"
    global = true
    slashCommandBuilder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .toJSON()
    async execute(client: ClassicClient, message: Message) {
        message.reply({ embeds: [await generateEmbed(client)] })
    }
    async slash(client: ClassicClient, interaction: CommandInteraction) {
        interaction.reply({ embeds: [await generateEmbed(client)] })
    }
}

async function generateEmbed(client: ClassicClient): Promise<EmbedBuilder> {
    const embed = new EmbedBuilder()
        .setTitle("Global Invite")
        .setDescription(
            "Why do we have a global invite? Well, it's because Prorickey doesn't want his name to be the name on the global invite link. So, we have a global invite link created by the bot!"
        )
        .addFields({
            name: "Invite Link",
            value: (await client.database.getGlobalInvite(client)).url
        })
        .setColor(0x33adff)
        .setFooter({
            text: "ClassicDupe Development",
            iconURL: client.config.staffIcon
        })

    return embed
}
