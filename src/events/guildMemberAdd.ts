import { EmbedBuilder, GuildMember, Invite, TextChannel } from "discord.js";
import { ClassicClient } from "..";

module.exports = async (client: ClassicClient, member: GuildMember) => {
    if(!process.env.ACTIVITY_CHANNEL_ID) return
    if(member.guild.id != process.env.GUILD_ID) return

    const channel: TextChannel = await client.channels.fetch(process.env.ACTIVITY_CHANNEL_ID) as TextChannel

    const newInvites = await client.guilds.cache.get(process.env.GUILD_ID)?.invites.fetch()
    const invite = newInvites?.find(invite => invite.uses as number > (client.invites?.get(invite.code)?.uses as number)) as Invite
    const inviter = client.guilds.cache.get(process.env.GUILD_ID)?.members.cache.get(invite?.inviter?.id as string) as GuildMember

    client.database.newInvite(
        member,
        inviter,
        invite.code
    )

    const embed = new EmbedBuilder()
        .setTitle(member.user.username + " Joined!")
        .setColor(Math.floor(Math.random() * 16777215))
        .setThumbnail(member.user.avatarURL())
        .setTimestamp()
        .setFooter({ text: "ClassicDupe Development", iconURL: client.staffIconUrl})
        .setDescription("Welcome to the server, " + member.user.username + "!\n\nPlay ClassicDupe @ `mc.classicdupe.com` on `1.20.1`!")
        .addFields(
            {
                name: "Links To Check Out!",
                value: "[Store](https://classicdupe.tebex.io)",
                inline: true
            },
            {
                name: "How To Link Your Account",
                value: "Execute /link in game and follow the instructions!",
                inline: true
            },
            {
                name: "Channels To Check Out!",
                value: "<#1068991976587935815> ・ <#1084477808773955595>\n<#1068991439205314573> ・ <#1078104100392157184>\n<#1103474177215828008> ・ <#1072650811328438403>"
            }
        )

    if(!inviter.user.bot) {
        embed.addFields(
            {
                name: "Invited By " + inviter.user.username,
                value: inviter.user.username + " has invited a total of " + (await client.database.getInviteData(inviter.id)).invites + " members!"
            }
        )
    }

    channel.send({ embeds: [embed] })

}