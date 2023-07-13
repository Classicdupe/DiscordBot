import { GuildMember } from "discord.js";
import { ClassicClient } from "..";

module.exports = async (client: ClassicClient, member: GuildMember) => {
    client.database.newLeave(member)
}