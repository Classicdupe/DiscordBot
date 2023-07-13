import { Invite } from "discord.js"
import { ClassicClient } from ".."

module.exports = async (client: ClassicClient, invite: Invite) => {

    if(invite.inviter?.bot) return
    client.database.deletedInvite(invite)
    client.invites.delete(invite.code)

}