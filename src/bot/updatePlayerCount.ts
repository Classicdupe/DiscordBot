import { Client, VoiceBasedChannel } from "discord.js";
import { Server } from "../server/server";

export default function updatePlayerCount(bot: Client, server: Server) {
    setInterval(() => {
        let chan: VoiceBasedChannel = bot.channels.cache.get(process.env.PLAYERCOUNT_UPDATE_CHANNEL_ID || "1084496172305092718") as VoiceBasedChannel
        chan.setName(`📈・Players Online: ${server.getPlayerCount()}`)
    }, 5 * 50 * 1000);
}