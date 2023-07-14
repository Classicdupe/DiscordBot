import {
    CommandInteraction,
    GuildMember,
    Message,
    SlashCommandBuilder
} from "discord.js"
import { Command, Permission } from "../../../command"
import { ClassicClient } from "../../.."
import ytdl from "ytdl-core"
import { MusicPlayer } from "../../../utils/musicPlayer"

export default class PlayCommand implements Command {
    name = "play"
    permission = Permission.Default
    description = "To play music with the bot!"
    category = "general"
    global = true
    slashCommandBuilder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
            option
                .setName("songurl")
                .setDescription(
                    "The youtube url of the song you want to listen to"
                )
                .setRequired(true)
        )
        .toJSON()
    execute(client: ClassicClient, message: Message) {
        message.reply("Pong!")
    }
    async slash(client: ClassicClient, interaction: CommandInteraction) {
        const songUrl = interaction.options.get("songurl")?.value as string
        const member = interaction.member as GuildMember

        if (!member.voice.channel)
            return interaction.reply({
                content: "You need to be in a voice channel to play music",
                ephemeral: true
            })

        let musicPlayer: MusicPlayer = {} as MusicPlayer
        if (!client.musicPlayers.has(member.guild.id)) {
            const voiceChannel = member.voice.channel
            musicPlayer = new MusicPlayer(client, voiceChannel)
            client.musicPlayers.set(member.guild.id, musicPlayer)
        } else if (
            member.voice.channelId !=
            client.musicPlayers.get(member.guild.id)?.channel.id
        )
            return interaction.reply({
                content: "You need to be in the same voice channel as the bot",
                ephemeral: true
            })
        else
            musicPlayer = client.musicPlayers.get(
                member.guild.id
            ) as MusicPlayer

        const valid = ytdl.validateURL(songUrl)
        if (!valid)
            return interaction.reply({
                content: "Invalid youtube url",
                ephemeral: true
            })

        musicPlayer.queueAdd(songUrl)

        const basicInfo = await ytdl.getInfo(songUrl)

        interaction.reply({
            content: `Added ${basicInfo.videoDetails.title} to the queue`
        })
    }
}
