import { Guild, GuildMember, Invite, TextChannel } from "discord.js"
import { readFileSync } from "fs"
import { createPool } from "mariadb"
import { ClassicClient } from "."

export class Database {
    pool

    constructor() {
        const dbdata: DatabaseData = JSON.parse(
            readFileSync("../resources/database.json", "utf-8")
        )
    
        this.pool = createPool({
            host: dbdata.host,
            user: dbdata.username,
            password: dbdata.password,
            database: dbdata.database
        })

        this.pool.execute(`CREATE TABLE IF NOT EXISTS invites(dscid TEXT, invites INT, repeats INT, fakes INT, extended INT, legacy BOOLEAN, invitedBy TEXT, fake BOOLEAN, invitedOn TIMESTAMP, memberNum INT NOT NULL AUTO_INCREMENT, CONSTRAINT invites_pk PRIMARY KEY (memberNum))`)
        this.pool.execute(`CREATE TABLE IF NOT EXISTS invite_codes(code TEXT, dscid TEXT, uses INT, expires TIMESTAMP, deleted BOOLEAN)`)
        this.pool.execute(`CREATE TABLE IF NOT EXISTS globalInvites(code TEXT, uses INT)`)

        console.log("Connected to database")
    }

    async loadAllUsers(guild: Guild) {
        const members = await guild.members.fetch()
        const sortedMembers = 
            members.sort((a, b) => {
                if(a.joinedAt && b.joinedAt) {
                    return a.joinedAt.getTime() - b.joinedAt.getTime()
                } else {
                    return 0
                }
            })
        for(let i = 0; i < sortedMembers.size; i++) {
            const member = sortedMembers.at(i) as GuildMember
            const result = await this.pool.query("SELECT dscid FROM invites WHERE dscid = ?", [member.id])
            if(result.length == 0) {
                this.pool.execute(
                    "INSERT INTO invites(dscid, invites, repeats, fakes, extended, legacy, invitedBy, fake, invitedOn, memberNum) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [member.id, 0, 0, 0, 0, 0, null, 0, new Date(), i+1]
                )
            }
        }
    }

    /**
     * To fetch the global invite, this invite isn't tied to any specific user
     * @param client 
     * @returns The global invite
     */
    getGlobalInvite(client: ClassicClient): Promise<Invite> {
        return new Promise(async (resolve, reject) => {
            const guild = client.guilds.cache.get(process.env.GUILD_ID as string)
            const infoChannel = guild?.channels.cache.get(process.env.INFO_CHANNEL_ID as string) as TextChannel
            const result = await this.pool.query(
                "SELECT code FROM globalInvites"
            )
            if(result.length == 0) {
                const invite = await guild?.invites.create(infoChannel, {
                    maxAge: 0,
                    temporary: false,
                })
                this.pool.execute(
                    "INSERT INTO globalInvites(code, uses) VALUES(?, ?)",
                    [invite?.code, 0]
                )
                resolve(invite as Invite)
            } else {
                const invites = await guild?.invites.fetch()
                const invite = invites?.get(result[0].code)
                if(!invite) {
                    const invite = await guild?.invites.create(infoChannel, {
                        maxAge: 0,
                        temporary: false,
                    })
                    this.pool.execute(
                        "UPDATE globalInvites SET code = ?",
                        [invite?.code]
                    )
                    resolve(invite as Invite)
                } else resolve(invite as Invite)
            }
        })
    }

    /**
     * Called when an invite is deleted
     * @param invite 
     */
    async deletedInvite(invite: Invite) {
        this.pool.execute(
            "UPDATE invite_codes SET deleted=1 WHERE code = ?",
            [invite.code]
        )
    }

    /**
     * Called when an invite is created
     * @param invite 
     */
    async createdInvite(invite: Invite) {
        this.pool.execute(
            "INSERT INTO invite_codes(code, dscid, uses, expires, deleted) VALUES(?, ?, ?, ?, 0)",
            [invite.code, invite.inviter?.id, invite.uses, invite.expiresAt, 0]
        )
    }

    /**
     * Called when a player leaves the discord
     * @param leaver 
     */
    async newLeave(leaver: GuildMember) {
        if(!leaver.joinedAt) return
        if(leaver.joinedAt.getMilliseconds() > new Date().getMilliseconds() - 1000 * 60 * 60 * 24 * 7) {
            const result = await this.pool.query(
                "SELECT * FROM invites WHERE dscid = ?",
                [leaver.id]
            )
            this.pool.execute(
                "UPDATE invites SET fakes=fakes+1, invites=invites-1 WHERE dscid = ?",
                [result[0].invitedBy]
            )
            this.pool.execute(
                "UPDATE invites SET fake=1 WHERE dscid=?",
                [leaver.id]
            )
            this.removeExtended(result[0].invitedBy)
        }
    }

    /**
     * Called when a player joins the discord
     * @param invitee The person who joined
     * @param inviter The person who invited them
     * @param code Invite code
     */
    async newInvite(invitee: GuildMember, inviter: GuildMember, code: string) {
        const result = await this.pool.query(
            "SELECT * FROM invites WHERE dscid = ?",
            [invitee.id]
        )
        if (result.length == 0) {
            this.pool.execute(
                "INSERT INTO invites(dscid, invites, repeats, fakes, extended, legacy, invitedBy, invitedOn, memberNum) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [invitee.id, 0, 0, 0, 0, 1, inviter.id, 0, new Date()]
            )
            if(inviter.user.bot) {
                this.pool.execute("UPDATE globalInvites SET uses=uses+1")
            } else {
                this.pool.execute(
                    "UPDATE invite_codes SET uses=uses+1 WHERE code = ?",
                    [code]
                )
                this.pool.execute(
                    "UPDATE invites SET invites=invites+1 WHERE dscid = ?",
                    [inviter.id]
                )
                this.addExtended(inviter.id)
            }
        } else {
            this.pool.execute(
                "UPDATE invites SET repeats=repeats+1 WHERE dscid = ?",
                [inviter.id]
            )
            if(result[0].fake) {
                this.pool.execute(
                    "UPDATE invites SET fakes=fakes-1 WHERE dscid = ?",
                    [result[0].invitedBy]
                )
                this.pool.execute(
                    "UPDATE invites SET fake=0 WHERE dscid=?",
                    [invitee.id]
                )
            }
        }
    }

    /**
     * Add an extended invite to the tree
     * @param dscid The id to start from
     */
    async addExtended(dscid: string) {
        const result = await this.pool.query(
            "SELECT * FROM invites WHERE dscid = ?",
            [dscid]
        )
        if (result.length != 0) {
            this.pool.execute(
                "UPDATE invites SET extended=extended+1 WHERE dscid = ?",
                [dscid]
            )
            if(result[0].invitedBy) this.addExtended(result[0].invitedBy)
        }
    }

    /**
     * Remove an extended invite from the tree
     * @param dscid The id to start from
     */
    async removeExtended(dscid: string) {
        const result = await this.pool.query(
            "SELECT * FROM invites WHERE dscid = ?",
            [dscid]
        )
        if (result.length != 0) {
            this.pool.execute(
                "UPDATE invites SET extended=extended-1 WHERE dscid = ?",
                [dscid]
            )
            if(result[0].invitedBy) this.removeExtended(result[0].invitedBy)
        }
    }

    /**
     * Get's the invite data of a player
     * @param dscid 
     * @returns The players invite data
     */
    getInviteData(dscid: string): Promise<PlayerInviteData> {
        return new Promise(async (resolve, reject) => {
            const result = await this.pool.query(
                "SELECT * FROM invites WHERE dscid = ?",
                [dscid]
            )
            if (result.length == 0) return reject("Invite not found")
            resolve({
                dscid: result[0].dscid,
                invites: result[0].invites,
                repeats: result[0].repeats,
                fakes: result[0].fakes,
                extended: result[0].extended,
                legacy: result[0].legacy,
                invitedBy: result[0].invitedBy,
                invitedOn: result[0].invitedOn,
                memberNum: result[0].memberNum,
                fake: result[0].fake
            })
        })
    }

    /**
     * Gets the player data by the player's name
     * @param name 
     * @returns The player data or rejects if it doesn't exist
     */
    getPlayerDataByName(name: string): Promise<PlayerData> {
        return new Promise(async (resolve, reject) => {
            const result = await this.pool.query(
                "SELECT * FROM players WHERE name = ?",
                [name]
            )
            if (result.length == 0) return reject("Player not found")
            /*const result2 = await this.pool.query(
                "SELECT * FROM playtime WHERE uuid = ?",
                [result[0].uuid]
            )
            if (result2.length == 0) return reject("Player not found")*/
            const playerData: PlayerData = {
                uuid: result[0].uuid,
                username: result[0].name,
                nickname: result[0].nickname,
                timesjoined: result[0].timesjoined,
                playtimeS: 0, //result2[0].season,
                playtimeO: 0, //result2[0].alltime,
                randomitems: result[0].randomitems,
                chatcolor: result[0].chatcolor,
                gradient: result[0].gradient,
                gradientfrom: result[0].gradientfrom,
                gradientto: result[0].gradientto,
                night: result[0].night
            }
            resolve(playerData)
        })
    }

    /**
     * Gets the player data by the player's uuid
     * @param uuid
     * @returns The player data or rejects if it doesn't exist
     */
    getPlayerDataByUUID(uuid: string): Promise<PlayerData> {
        return new Promise(async (resolve, reject) => {
            const result = await this.pool.query(
                "SELECT * FROM players WHERE uuid = ?",
                [uuid]
            )
            if (result.length == 0) return reject("Player not found")
            /*const result2 = await this.pool.query(
                "SELECT * FROM stats WHERE uuid = ?",
                [uuid]
            )
            if (result2.length == 0) return reject("Player not found")*/
            const playerData: PlayerData = {
                uuid: result[0].uuid,
                username: result[0].name,
                nickname: result[0].nickname,
                timesjoined: result[0].timesjoined,
                playtimeS: 0, //result2[0].season,
                playtimeO: 0, //result2[0].alltime,
                randomitems: result[0].randomitems,
                chatcolor: result[0].chatcolor,
                gradient: result[0].gradient,
                gradientfrom: result[0].gradientfrom,
                gradientto: result[0].gradientto,
                night: result[0].night
            }
            resolve(playerData)
        })
    }

    /**
     * Get's a player's link data by their discord id
     * @param discordId 
     * @returns Link data or undefined if they are not linked
     */
    getLinkDataByDiscord(discordId: string): Promise<LinkData | undefined> {
        return new Promise(async (resolve, reject) => {
            const result = await this.pool.query(
                "SELECT * FROM link WHERE dscid = ?",
                [discordId]
            )
            if (result.length == 0) return resolve(undefined)
            const linkData: LinkData = {
                uuid: result[0].uuid,
                discordId: result[0].dscid
            }
            resolve(linkData)
        })
    }

    /**
     * Get's a player's link data by their uuid
     * @param uuid 
     * @returns Link data or undefined if they are not linked
     */
    getLinkDataByUUID(uuid: string): Promise<LinkData | undefined> {
        return new Promise(async (resolve, reject) => {
            const result = await this.pool.query(
                "SELECT * FROM link WHERE uuid = ?",
                [uuid]
            )
            if (result.length == 0) return resolve(undefined)
            const linkData: LinkData = {
                uuid: result[0].uuid,
                discordId: result[0].dscid
            }
            resolve(linkData)
        })
    }

    /**
     * Get's a player's link data by their uuid
     * @param uuid 
     * @returns The player's stats
     */
    getPlayerStats(uuid: string): Promise<PlayerStats> {
        return new Promise(async (resolve, reject) => {
            const result = await this.pool.query(
                "SELECT * FROM stats WHERE uuid = ?",
                [uuid]
            )
            if (result.length == 0) return reject("Player not found")
            const stats: PlayerStats = {
                kills: result[0].kills,
                deaths: result[0].deaths,
                kdr: result[0].kills / result[0].deaths
            }
            resolve(stats)
        })
    }

}

export interface PlayerInviteData {
    dscid: string;
    invitedBy: string;
    invitedOn: Date;
    memberNum: number;
    invites: number;
    repeats: number;
    fakes: number;
    extended: number;
    legacy: boolean;
    fake: boolean;
}

export interface ClanData {
    uuid: string;
    name: string;
    clanKills: number;
    owner: ClanMemberData;
    admins: ClanMemberData[];
    mods: ClanMemberData[];
    vips: ClanMemberData[];
    defaults: ClanMemberData[];
    members: ClanMemberData[];
    publicClan: boolean;
    clanColor: string;
    warps: ClanWarpData[];
}

export interface ClanWarpData {
    name: string;
    location: string;
    level: number;
}

export interface ClanMemberData {
    uuid: string;
    clan: ClanData;
    level: number;
    name: string;
}

export interface PlayerData {
    uuid: string
    username: string
    nickname: string
    timesjoined: number
    playtimeS: number
    playtimeO: number
    randomitems: boolean
    chatcolor: string
    gradient: boolean
    gradientfrom: string
    gradientto: string
    night: boolean
}

export interface LinkData {
    uuid: string
    discordId: string
}

export interface PlayerStats {
    kills: number
    deaths: number
    kdr: number
}

interface DatabaseData {
    host: string
    username: string
    password: string
    database: string
}
