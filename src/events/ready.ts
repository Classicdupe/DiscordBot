import { Collection, Guild } from "discord.js"
import { ClassicClient } from ".."

module.exports = async (client: ClassicClient) => {
    console.log("Discord bot is now online")

    const invites = await client.guilds.cache
        .get(client.config.main.guildId)
        ?.invites.fetch()
    client.invites = new Collection(
        invites?.map((invite) => [invite.code, invite.uses as number])
    )

    client.database.loadAllUsers(
        client.guilds.cache.get(client.config.main.guildId) as Guild
    )
    client.database.loadAllInvites(
        client.guilds.cache.get(client.config.main.guildId) as Guild
    )

    client.database.checkClanAdminOwner(client)
    setTimeout(
        () => {
            client.database.checkClanAdminOwner(client)
        },
        1000 * 60 * 5
    )
}
