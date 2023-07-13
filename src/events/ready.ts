import { Client, Guild } from "discord.js";
import { ClassicClient } from "..";

module.exports = async (client: ClassicClient) => {

    console.log("Discord bot is now online")

    if(!process.env.GUILD_ID) return
    client.guilds.cache.get(process.env.GUILD_ID)?.invites.fetch()
    .then(invites => {
        client.invites = invites
    })

    client.database.loadAllUsers(client.guilds.cache.get(process.env.GUILD_ID) as Guild)

}