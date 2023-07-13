import { Client, Collection, Guild, Invite } from "discord.js";
import { ClassicClient } from "..";

module.exports = async (client: ClassicClient) => {

    console.log("Discord bot is now online")

    if(!process.env.GUILD_ID) return
    const invites = await client.guilds.cache.get(process.env.GUILD_ID)?.invites.fetch()
    client.invites = new Collection(invites?.map(invite => [invite.code, invite.uses as number]))

    client.database.loadAllUsers(client.guilds.cache.get(process.env.GUILD_ID) as Guild)
    client.database.loadAllInvites(client.guilds.cache.get(process.env.GUILD_ID) as Guild)

}