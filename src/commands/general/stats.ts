import { Client, CommandInteraction, Message, SlashCommandBuilder, User } from "discord.js"
import { Command, Permission } from "../../command"
import { Database, LinkData, PlayerData, PlayerStats } from "../../database"
import { EmbedBuilder } from "@discordjs/builders"
import { ClassicClient } from "../.."

export default class StatsCommand implements Command {
    name = "stats"
    permission = Permission.Default
    description = "To get the stats of a player"
    category = "general"
    slashCommandBuilder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
            option
                .setName("player")
                .setDescription("The player to get the stats of")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to get the stats of")
                .setRequired(false)
        )
        .toJSON()
    execute(client: ClassicClient, message: Message, command: any, args: any) {
        message.reply("Pong!")
    }
    async slash(client: ClassicClient, interaction: CommandInteraction) {
        const player = interaction.options.get("player")
        const user = interaction.options.get("user")

        if (player != null) {
            const playerData: PlayerData =
                await client.database.getPlayerDataByName(
                    player.value as string
                )
            const playerStats: PlayerStats =
                await client.database.getPlayerStats(playerData.uuid)
            const linkData: LinkData | undefined =
                await client.database.getLinkDataByUUID(playerData.uuid)

            if (playerStats == null) {
                interaction.reply("Player not found")
                return
            }

            const linked =
                "Linked to: " +
                (linkData
                    ? "<@" + linkData.discordId + ">"
                    : "No Discord Account")

            
            const hours = `0${new Date(playerData.playtimeS).getHours()}`.slice(
                -2
            )
            const minutes = `0${new Date(
                playerData.playtimeS
            ).getMinutes()}`.slice(-2)
            const seconds = `0${new Date(
                playerData.playtimeS
            ).getSeconds()}`.slice(-2)

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(playerData.username + "'s Stats")
                        .setColor(0xff4646)
                        .setThumbnail(
                            "http://cravatar.eu/helmavatar/" + playerData.uuid
                        )
                        .setDescription(
                            "Nickname: " +
                                (playerData.nickname
                                    ? playerData.nickname
                                    : "No Nickname") +
                                "\n" +
                                "Clan: Coming Soon\n" +
                                "Kills: " +
                                playerStats.kills +
                                "\n" +
                                "Deaths: " +
                                playerStats.deaths +
                                "\n" +
                                "K/D: " +
                                (
                                    playerStats.kills / playerStats.deaths
                                ).toFixed(2) +
                                "\n" +
                                `Playtime: Coming Soon\n` + //${hours}:${minutes}:${seconds}\n` +
                                linked
                        )
                        .setFooter({ text: "ClassicDupe Development", iconURL: client.staffIconUrl})
                ]
            })
        } else if (user != null) {
            const linkData: LinkData | undefined =
                await client.database.getLinkDataByDiscord(
                    (user.user as User).id.toString()
                )

            if (linkData == null) {
                interaction.reply("That user is not linked to any account")
                return
            }

            const playerData: PlayerData =
                await client.database.getPlayerDataByUUID(linkData.uuid)
            const playerStats: PlayerStats =
                await client.database.getPlayerStats(linkData.uuid)

            if (playerStats == null) {
                interaction.reply("Player not found")
                return
            }

            const hours = `0${new Date(playerData.playtimeS).getHours()}`.slice(
                -2
            )
            const minutes = `0${new Date(
                playerData.playtimeS
            ).getMinutes()}`.slice(-2)
            const seconds = `0${new Date(
                playerData.playtimeS
            ).getSeconds()}`.slice(-2)

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(playerData.username + "'s Stats")
                        .setColor(0xff4646)
                        .setThumbnail(
                            "http://cravatar.eu/helmavatar/" + playerData.uuid
                        )
                        .setDescription(
                            "Nickname: " +
                                (playerData.nickname
                                    ? playerData.nickname
                                    : "No Nickname") +
                                "\n" +
                                "Clan: Coming Soon\n" +
                                "Kills: " +
                                playerStats.kills +
                                "\n" +
                                "Deaths: " +
                                playerStats.deaths +
                                "\n" +
                                "K/D: " +
                                (
                                    playerStats.kills / playerStats.deaths
                                ).toFixed(2) +
                                "\n" +
                                `Playtime: Coming Soon\n` + //${hours}:${minutes}:${seconds}\n` +
                                `Linked To: <@${linkData.discordId}>`
                        )
                        .setFooter({ text: "ClassicDupe Development", iconURL: client.staffIconUrl})
                ]
            })
        }
    }
}
