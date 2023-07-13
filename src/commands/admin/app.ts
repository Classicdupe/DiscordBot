import {
    Client,
    CommandInteraction,
    PermissionFlagsBits,
    Role,
    SlashCommandBuilder,
    User
} from "discord.js"
import { Command, Permission } from "../../command"
import { readFileSync } from "fs"
import { Database } from "../../database"
import { ClassicClient } from "../.."

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
    slash(client: ClassicClient, interaction: CommandInteraction): void {
        const user = interaction.options.get("user", true).user as User
        const accept = interaction.options.get("accept", true).value as Boolean
        const reason = interaction.options.get("reason", false)

        if (accept) {
            user.createDM()

            user.send({
                content: readFileSync("../resources/accepted.txt", "utf8"),
                embeds: [
                    {
                        "title": `Staff Information and Guides`,
                        "description": `Welcome to the staff team. Here is a general reference guide on how to moderate ClassicDupe. Of course, if you have any questions please ask an administrator or other staff members. `,
                        "color": 0x246dff,
                        "fields": [
                            {
                                "name": `What is your job?`,
                                "value": `Your job as a moderator is to help everyone enjoy the server. You have a special power to punish players that break the rules and ruin the fun on the server. Use this priviledge appropriatly and when needed. Also as a moderator we expect that you are kind and respectful and help out new players. It can be hard for new players to get their footing so help them out. Don't be overly aggressive or a mean player in game, you should be an enjoyable person to play with. `
                            },
                            {
                                "name": `Abusing your powers`,
                                "value": `You are given special permissions to punish players and to help moderate the server. Abuse of these powers in unfair ways will not be tolerated and will result in your immediate demotion. If you see another staff member abusing their powers, please notify an admin. `
                            },
                            {
                                "name": `Be a good representation of the server`,
                                "value": `We want our staff team to have a good reputation and do their job well. This means you should step in when needed and you shouldn't be always hidden. You need to be social in the server and well known. This also means we expect you to handle heated situations in a calm, respectful and collected manner. `
                            },
                            {
                                "name": "Staff Discord",
                                "value": "This discord server is starting to get cluttered with staff resources, so we have created a staff discord. [Click Me To Join!](https://discord.gg/c9bQwRD2s)"
                            }
                        ],
                        "footer": {
                            "text": "ClassicDupe Development",
                            "icon_url": client.staffIconUrl
                        }
                    },
                    {
                        "title": `Your Commands and Abilities`,
                        "description": `Here is a guide of what permissions and commands you have access to and what they do. Look below at the plugin pages for more in depth explanations on how to use the plugins.\n\nAntiCheat - Vulcan\nhttps://www.spigotmc.org/resources/vulcan-anti-cheat-advanced-cheat-detection-1-7-1-19-3.83626/\n\nModeration Plugin - LibertyBans\nhttps://docs.libertybans.org/#/Getting-Started\n\nVanish Plugin - SuperVanish\nhttps://www.spigotmc.org/resources/supervanish-be-invisible.1331/\n\nCoreProtect - https://docs.coreprotect.net/commands/\n\nFAWE - https://intellectualsites.github.io/fastasyncworldedit-documentation/basic-commands/main-commands-and-permissions.html`,
                        "color": 0x03b120,
                        "footer": {
                            "text": "ClassicDupe Development",
                            "icon_url": client.staffIconUrl
                        }
                    }
                ]
            })

            user.send({
                embeds: [
                    {
                        "title": `SrAdmin`,
                        "description": `You have * perms on the dupe server level`,
                        "color": 0xEE6244,
                        "footer": {
                            "text": "ClassicDupe Development",
                            "icon_url": client.staffIconUrl
                        }
                    },
                    {
                        "title": `Admin Pt1`,
                        "description": `**You have all the previous roles permissions.**\n\n**OpenInv**\nYou may now edit the inventories and ender chests of other players\n\n**FAWE <Worldedit>**\n//wand - Get the wand object\n//hpos1 - Set position 1 to targeted block\n//hpos2 - Set position 2 to targeted block\n//outset [-h] [-v] <amount> - Expand the selection\n//inset [-h] [-v] <amount> - Shrink the selection\n//distr - Get the distribution of blocks in the selection\n//chunk - Set the selection to the current chunk you are in\n//pos1 - Set position 1\n//pos2 - Set position 2\n//contract <amount> [reverseAmount] [direction] - Contract the selection area\n//shift <amount> [direction] - Shift the selection area\n//expand <vert|<amount> [reverseAmount] [direction]> - Expand the selection area\n//size [-c] - Get information about the selection\n//count <mask> - Counts the number of blocks matching a mask\n//undo - Undo whatever you just did\n//move [-abes] [multiplier] [offset] [replace] [-m <mask>] - Move the contents of the selection\n//line [-h] <pattern> [thickness] - Draws line segments between cuboid selection corners or convex polyhedral selection vertices\n//overlay <pattern> - Set a block on top of blocks in the region\n//curve [-h] <pattern> [thickness] - Draws a spline through selected points\n//center <pattern> - Set the center block<s>`,
                        "color": 0xff4545,
                        "footer": {
                            "text": "ClassicDupe Development",
                            "icon_url": client.staffIconUrl
                        }
                    },
                    {
                        "title": `Admin Pt2`,
                        "description": `//faces <pattern> - Build the walls, ceiling, and floor of a selection\n//hollow [thickness] [pattern] - Hollows out the object contained in this selection\n//set <pattern> - Sets all the blocks in the region\n//stack [-abers] [count] [offset] [-m <mask>] - Repeat the contents of the selection\n//replace [from] <to> - Replace all blocks in the selection with another\n//fill <pattern> <radius> [depth] - Fill a hole\n//drain [-w] <radius> - Drain a pool\n/removenear <mask> [radius] - Remove blocks near you.\n/fixlava <radius> - Fix lava to be stationary\n/removeabove [size] [height] - Remove blocks above your head.\n//fillr <pattern> <radius> [depth] - Fill a hole recursively\n/replacenear <radius> [from] <to> - Replace nearby blocks\n/fixwater <radius> - Fix water to be stationary\n//calculate <input...> - Evaluate a mathematical expression\n/extinguish [radius] - Extinguish nearby fire\n//copy [-be] [-m <mask>] - Copy the selection to the clipboard\n//flip [direction] - Flip the contents of the clipboard across the origin\n//rotate <rotateY> [rotateX] [rotateZ] - Rotate the contents of the clipboard\n//cut [-be] [leavePattern] [-m <mask>] - Cut the selection to the clipboard\n//paste [-abenos] [-m <sourceMask>] - Paste the clipboard’s contents\n/clearclipboard - Clear your clipboard\n/listchunks [-p <page>] - List chunks that your selection includes\n/chunkinfo - Get information about the chunk you’re inside\n\n**Permissions**\nworldedit.wand - worldedit.wand.toggle - worldedit.selection.hpos - worldedit.selection.outset - worldedit.selection.hpos - worldedit.selection.inset - worldedit.analysis.distr - worldedit.selection.chunk - worldedit.selection.pos - worldedit.selection.pos - worldedit.selection.contract - worldedit.selection.shift - worldedit.selection.expand - worldedit.selection.size - worldedit.analysis.count - worldedit.tool.inspect - worldedit.history.undo - worldedit.history.rollback - worldedit.region.move - worldedit.region.line - worldedit.light.fix - worldedit.region.overlay - worldedit.region.overlay - worldedit.region.curve - worldedit.light.set - worldedit.nbtinfo - worldedit.light.set - worldedit.region.center - worldedit.region.faces - worldedit.region.hollow - worldedit.region.fall - worldedit.region.set - worldedit.region.stack - worldedit.region.replace - worldedit.fill - worldedit.drain - worldedit.removenear - worldedit.fixlava - worldedit.removeabove - worldedit.masks - worldedit.fill.recursive - worldedit.replacenear - worldedit.fixwater - fawe.confirm - worldedit.calc - worldedit.extinguish - worldedit.clipboard.copy - worldedit.clipboard.flip - worldedit.clipboard.rotate - worldedit.clipboard.lazycopy - worldedit.clipboard.asset - worldedit.clipboard.cut - worldedit.clipboard.download - worldedit.clipboard.paste - worldedit.clipboard.lazycut - worldedit.clipboard.place - worldedit.clipboard.clear - worldedit.listchunks - worldedit.chunkinfo`,
                        "color": 0xff4545,
                        "footer": {
                            "text": "ClassicDupe Development",
                            "icon_url": client.staffIconUrl
                        }
                    },
                ]
            })

            user.send({
                embeds: [
                    {
                        "title": `JrAdmin`,
                        "description": `**You have all the previous roles permissions.**\n\n**Vulcan** \n/vulcan menu/vulcan gui - Open Vulcan's GUI.\n/vulcan connection (player) - Shows connection info about a player.\n\n**CoreProtect**\n/co rb/co rollback u:<user> t:<time> r:<radius> a:<action> i:<include> e:<exclude> - Rollback a player's block interactions (can also just rollback in general)\n/co rs/co restore u:<user> t:<time> r:<radius> a:<action> i:<include> e:<exclude> - Undo rollbacks\n/co consumer - Pause or resume consumer queue processing\n/co status - View plugin info, and version info.\n\n**OpenInv**\n/openinv/oi/inv/open (player) - See the inventory of the specified player\n/openender/oe (player) - See the ender chest of the specified player\n/searchinv/si (item) (minamount) - List all players that have this specific item in their inventory\n/searchender/se (item) (minamount) - List all players that have this specific item in their ender chest\n/searchenchant/searchenchants (enchantment) (minlevel) - List all online players that have this specific enchantment\n/anycontainer/ac/anychest - toggle AnyContainer mode (blocked container bypass)\n/silentcontainer/sc/silent/silentchest - Toggles SilentContainer mode (open containers silently)\n\n**Maintenance**\nAllows you to bypass the maintenence mode on the server.\n\n**Permissions**\nvulcan.connection - vulcan.gui - coreprotect.rollback - coreprotect.restore - coreprotect.status - coreprotect.consumer - OpenInv.openinv - OpenInv.openself - OpenInv.openender - OpenInv.openenderall - OpenInv.search - OpenInv.searchenchant - OpenInv.crossworld - OpenInv.anychest - OpenInv.silent - maintenance.bypass`,
                        "color": 0xF3AD1D,
                        "footer": {
                            "text": "ClassicDupe Development",
                            "icon_url": client.staffIconUrl
                        }
                    },
                    {
                        "title": `SrMod`,
                        "description": `**You have all the previous roles permissions.**\n\n**Vulcan**\n/jday add (player) - Adds a player to Judgement Day\n/jday execute - Executes Judgement Day\n/vulcan knockback/vulcan kb (player) - Test a player for anti-knockback\n/vulcan reset - Reset violations of all online players.\n/vulcan freeze - Freeze a player, disallowing them of moving.\n\n**LibertyBans**\n/accounthistory list (player) - Get a list of known accounts related to this player\n/accounthistory delete (player) - Delete the list of known accounts related to this player\n\n**ClassicDupe**\n/broadcast (text) - Broadcast a message to the server\n\n**CoreProtect**\n/co i/co inspect - Toggles inspect mode\n/co lookup/co l u:<user> t:<time> r:<radius> a:<action> i:<include> e:<exclude> - See history of player's interactions with blocks\n/co help - Coreprotect's help command\n\n**Permissions**\nvulcan.jday - vulcan.knockback - vulcan.reset - vulcan.freeze - libertybans.alts.accounthistory - libertybans.alts.accounthistory.delete - libertybans.alts.accounthistory.list - mod.broadcast - coreprotect.inspect - coreprotect.lookup - coreprotect.teleport - coreprotect.help - coreprotect.co - coreprotect.core - coreprotect.coreprotect\n\n`,
                        "color": 0xFF49E6,
                        "footer": {
                            "text": "ClassicDupe Development",
                            "icon_url": client.staffIconUrl
                        }
                    }
                ]
            })

            client.database.getLinkDataByDiscord(user.id).then((linkData) => {
                if(linkData == null) return
                fetch("https://lp.classicdupe.com/user/" + linkData.uuid + "/nodes?uniqueId=" + linkData.uuid, {
                    method: "PUT", 
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + process.env.LP_TOKEN
                    },
                    body: JSON.stringify([
                        {
                            key: "group.jrmod",
                            value: true
                        }
                    ])
                })
            })

            const role: Role | undefined = client.guilds.cache.get("1068991438391623836")?.roles.cache.find((role) => role.id == "1119377495347703890");
            if(role == null) return
            client.guilds.cache.get("1068991438391623836")?.members.cache.get(user.id)?.roles.add(role)

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
                        ],
                        "footer": {
                            "text": "ClassicDupe Development",
                            "icon_url": client.staffIconUrl
                        }
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
