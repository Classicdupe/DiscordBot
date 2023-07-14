import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js"
import { Command, Permission } from "../../command"
import { ClassicClient } from "../.."

export default class Minehut implements Command {
    name = "minehut"
    permission = Permission.Default
    description = "To interact with minehut's api"
    category = "general"
    global = true
    slashCommandBuilder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addSubcommand((subcommand) => 
            subcommand
                .setName("stats")
                .setDescription("Get the stats of minehut")
        )
        .toJSON()
    execute(client: ClassicClient, message: Message) {
        message.reply("Pong!")
    }
    async slash(client: ClassicClient, interaction: ChatInputCommandInteraction) {
        if(interaction.options.getSubcommand() == "stats") {
            
            let distribution;
            let simple;
            let homepage;
            try {
                distribution = await fetch("https://api.minehut.com/network/players/distribution").then(res => res.json())
                simple = await fetch("https://api.minehut.com/network/simple_stats").then(res => res.json())
                homepage = await fetch("https://api.minehut.com/network/homepage_stats").then(res => res.json())
            } catch(e) {
                return interaction.reply({
                    content: "An error occured while fetching the data, try checking if minehut is online right now.",
                    ephemeral: true
                })
            }

            const embed = new EmbedBuilder()
                .setTitle("Minehut Stats")
                .setColor(0x33FF68)
                .addFields(
                    {
                        name: "Simple Stats",
                        value: `**Online Servers**: ${simple.server_count}
                        **Server Limit**: ${simple.server_max}
                        **Used Ram**: ${Math.round(simple.ram_count/1000)} GB
                        **Max Ram**: ${simple.ram_max} GB
                        **Total Servers**: ${homepage.server_count}
                        **Total Accounts**: ${homepage.user_count}`,
                        inline: true
                    },
                    {
                        name: "Player Distribution",
                        value: `**Total Players**: ${distribution.javaTotal+distribution.bedrockTotal}
                        Bedrock: ${distribution.bedrockTotal}
                        Java: ${distribution.javaTotal}
                        **Total Lobby Players**: ${distribution.bedrockLobby+distribution.javaLobby}
                        Bedrock Lobby: ${distribution.bedrockLobby}
                        Java Lobby: ${distribution.javaLobby}
                        **Total Server Players**: ${distribution.bedrockPlayerServer+distribution.javaPlayerServer}
                        Bedrock Server: ${distribution.bedrockPlayerServer}
                        Java Server: ${distribution.javaPlayerServer}`,
                        inline: true
                    }
                )
                .setFooter({
                    text: "ClassicDupe Development",
                    iconURL: client.config.staffIcon
                })

            interaction.reply({
                embeds: [embed]
            })

        }
    }
}
