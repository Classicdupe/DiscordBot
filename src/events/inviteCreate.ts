import { Invite } from "discord.js";
import { ClassicClient } from "..";

module.exports = async (client: ClassicClient, invite: Invite) => {

    if(invite.inviter?.bot) return
    client.database.createdInvite(invite)
    client.invites.set(invite.code, invite.uses as number)

}