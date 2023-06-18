import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    User
} from "discord.js"
import { Command, Permission } from "../../command"
import { readFileSync } from "fs"
import { ImportantStuff } from "../../bot"

export default class AppCommand implements Command {
    name = "app"
    permission = Permission.Admin
    description = "To accept or deny people's applications"
    category = "admin"
    slashCommandBuilder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to accept or deny")
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("accept")
                .setDescription(
                    "Whether to accept or deny the user(true is accept, false is deny)"
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for denying the user")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .toJSON()
    execute = undefined
    slash(imstuff: ImportantStuff, interaction: CommandInteraction): void {
        const user = interaction.options.get("user", true).user as User
        const accept = interaction.options.get("accept", true).value as Boolean
        const reason = interaction.options.get("reason", false)

        if (accept) {
            user.createDM()

            user.send({
                content: readFileSync("../resources/accepted.txt", "utf8"),
                embeds: [
                    {
                        title: `Staff Information and Guides`,
                        description: `Welcome to the staff team. Here is a general reference guide on how to moderate ClassicDupe. Of course, if you have any questions please ask an administrator or other staff members. `,
                        color: 0x246dff,
                        fields: [
                            {
                                name: `What is your job?`,
                                value: `Your job as a moderator is to help everyone enjoy the server. You have a special power to punish players that break the rules and ruin the fun on the server. Use this priviledge appropriatly and when needed. Also as a moderator we expect that you are kind and respectful and help out new players. It can be hard for new players to get their footing so help them out. Don't be overly aggressive or a mean player in game, you should be an enjoyable person to play with. `
                            },
                            {
                                name: `Abusing your powers`,
                                value: `You are given special permissions to punish players and to help moderate the server. Abuse of these powers in unfair ways will not be tolerated and will result in your immediate demotion. If you see another staff member abusing their powers, please notify an admin. `
                            },
                            {
                                name: `Be a good representation of the server`,
                                value: `We want our staff team to have a good reputation and do their job well. This means you should step in when needed and you shouldn't be always hidden. You need to be social in the server and well known. This also means we expect you to handle heated situations in a calm, respectful and collected manner. `
                            }
                        ]
                    },
                    {
                        title: `Your Commands and Abilities`,
                        description: `Here is a guide of what permissions and commands you have access to and what they do. Look below at the plugin pages for more in depth explanations on how to use the plugins.\n\nAntiCheat - Vulcan\nhttps://www.spigotmc.org/resources/vulcan-anti-cheat-advanced-cheat-detection-1-7-1-19-3.83626/\n\nModeration Plugin - AdvancedBan\nhttps://www.spigotmc.org/resources/advancedban.8695/\n\nVanish Plugin - SuperVanish\nhttps://www.spigotmc.org/resources/supervanish-be-invisible.1331/`,
                        color: 0x03b120
                    },
                    {
                        title: `Vulcan Commands and Permissions`,
                        description: `/alerts - Enable or disable Vulcan alerts\n/verbose - Toggle Vulcan verbose messages\n/jday (execute|add) (player) - Judgment Day commands\n/logs (player) (page) - Read a player's logs\n/punishlogs (player) - Check a player's punishments\n/vulcan help - Shows vulcans help command\n/vulcan menu/gui - Opens Vulcan's GUI\n/vulcan freeze (freeze) - Freeze a player\n/vulcan violations (player) - View a players violations\n/vulcan cps (player) - Display a player's CPS\n/vulcan knockback/kb (player) - Test a player for anti-knockback\n/vulcan checks - Display all checks\n/vulcan reset - Reset all violations\n/vulcan clickalert (player) - Custom lists of commands to be executed when clicking an alert message\n/vulcan top - Shows users with the most violations\n/vulcan connection (player) - Shows connection information\n/vulcan profile (player) - Shows a player's profile`,
                        color: 0xcd4b00,
                        fields: [
                            {
                                name: `Permissions`,
                                value: `vulcan.alerts - vulcan.checks - vulcan.connection - vulcan.clickalert - vulcan.cps - vulcan.freeze - vulcan.gui - vulcan.help - vulcan.jday - vulcan.knockback - vulcan.lgos - vulcan.menu - vulcan.profile - vulcan.punishlogs - vulcan.reset - vulcan.top - vulcan.verbose - vulcan.violations`
                            }
                        ]
                    },
                    {
                        title: `AdvancedBan Commands and Permissions`,
                        description: `/kick (-s) (player) (reason|layout) - Kick a player\n/ban/mute/warn/note (-s) (player/ip) (reason/layout) - Ban/Mute/Warn/Note a player\n/banip (-s) (player/ip) (reason|layout) - Ban a player's ip\n/tempban/tempmute/tempwarn (-s) (player) (Xmo|Xd|Xh|Xm|Xs|timelayout) (reason|layout) - Tempban/mute/warn a player for a given time \n/tempipban (-s) (player/ip) (Xmo|Xd|Xh|Xm|Xs|timelayout) (reason|layout) - Tempipban a player's ip\n/change-reason (ID) (reason) - Change a reason for a punishment\n/change-reason (ban|mute) (player) (reason) - Change a reason for a ban or mute\n/unban/unmute (player) - Unban or unmute a player\n/unwarn/unnote (ID) - Remove a warn or note\n/unpunish (ID) - Remove a punishment\n/warns/notes (player) - List warnings or notes on a player\n/check (player) - Get player-status: UUID/IP/Country/Ban-Status/Mute-Status/Warn-Count/Note-Count\n/banlist (page) - Get the banlist\n/history (player) (page) - Get all active punishments\n/advancedban (help) - Get the help message`,
                        color: 0xfd3434,
                        fields: [
                            {
                                name: `Permissions`,
                                value: `ab.kick.use - ab.mute.exempt - ab.mute.perma - ab.mute.temp - ab.mute.undo - ab.note.exempt - ab.note.undo - ab.note.use - ab.notify.ban - ab.notify.ipban - ab.notify.kick - ab.notify.mute - ab.notify.note - ab.notify.tempban - ab.notify.tempipban - ab.notify.tempmute - ab.notify.tempwarn - ab.notify.warn - ab.tempipban.exempt - ab.undoNotify.ban - ab.undoNotify.mute - ab.undoNotify.note - ab.undoNotify.warn - ab.warn.exempt - ab.warn.perma - ab.warn.temp - ab.warn.undo`
                            }
                        ]
                    },
                    {
                        title: `SuperVanish Commands and Permissions`,
                        description: `/sv (help) - Display the help message \n/sv (on|off) - Puts you into Vanish or takes you out of Vanish\n/sv (list) - Shows you whos in vanish\n/sv (login|logout) - Broadcasts either a login message or logout message for you\n/sv (tipu) - Toggle picking up items in vanish`,
                        color: 0xcd00bc,
                        fields: [
                            {
                                name: `Permissions`,
                                value: `sv.list - sv.login - sv.logout - sv.silentchest - sv.toggleitems - sv.use`
                            }
                        ]
                    },
                    {
                        title: `Server Specific Commands and Permissions`,
                        description: `/mutechat - To mute the chat\n/sc (on|off) - To enable or disable staff chat\n/clearchat - To clear the chat\n/spec - To go in and out of spectator mode\n/broadcast (message) - To broadcast messages to the server`,
                        color: 0x1bc500,
                        fields: [
                            {
                                name: `Permissions`,
                                value: `mod.mutechat - mod.staffchat - mod.clearchat - mod.spec - mod.broadcast`
                            }
                        ]
                    }
                ]
            })

            interaction.reply({
                content: "Accepted <@" + user.id + ">",
                ephemeral: true
            })
        } else {
            user.createDM()
            user.send({
                content: readFileSync("../resources/denied.txt", "utf8"),
                embeds: [
                    {
                        title: "Application Denied",
                        color: 0xff2020,
                        fields: [
                            {
                                name: "Reviewed By",
                                value: "<@" + interaction.user.id + ">",
                                inline: true
                            },
                            {
                                name: "Reason",
                                value: reason
                                    ? (reason.value as string)
                                    : "No reason provided",
                                inline: true
                            }
                        ]
                    }
                ]
            })

            interaction.reply({
                content: "Denied <@" + user.id + ">",
                ephemeral: true
            })
        }
    }
}
