import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    NoSubscriberBehavior,
    VoiceConnection,
    VoiceConnectionStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel
} from "@discordjs/voice"
import { VoiceBasedChannel } from "discord.js"
import ytdl from "ytdl-core"
import { ClassicClient } from ".."

export class MusicPlayer {
    client: ClassicClient
    channel: VoiceBasedChannel
    connection: VoiceConnection
    player: AudioPlayer
    queue: MusicPlayerQueueObject[] = []
    playing: boolean = false

    constructor(client: ClassicClient, channel: VoiceBasedChannel) {
        this.client = client
        this.channel = channel

        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        })

        this.connection.on("error", (error) => {
            console.error(error)
            this.destroy()
        })

        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        })

        this.connection.subscribe(this.player)

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.playing = false
            this._playNext()
        })

        this.player.on("error", (error) => {
            console.error(error)
            this.playing = false
            this._playNext()
        })

        this.connection.on(VoiceConnectionStatus.Disconnected, () => {
            this.destroy()
        })
    }

    _playNext() {
        if (this.queue.length == 0) return
        const queueObj = this.queue[0]
        this.queue.shift()
        this.player.play(queueObj.resource)
        this.playing = true
    }

    getQueue(): MusicPlayerQueueObject[] {
        return this.queue
    }

    async queueRemove(index: number) {
        this.queue.splice(index, 1)
    }

    async queueAdd(url: string) {
        const info = await ytdl.getBasicInfo(url)

        const resource = createAudioResource(
            ytdl(url, {
                quality: "highestaudio"
            })
        )

        if (!this.playing) {
            this.queue.push({
                title: info.videoDetails.title,
                url: url,
                resource: resource
            })
            this._playNext()
        } else {
            this.queue.push({
                title: info.videoDetails.title,
                url: url,
                resource: resource
            })
        }
    }

    destroy() {
        this.connection.destroy()
        this.player.stop()
        this.client.musicPlayers.delete(this.channel.guild.id)
    }
}

export type MusicPlayerQueueObject = {
    title: string
    url: string
    resource: AudioResource
}
