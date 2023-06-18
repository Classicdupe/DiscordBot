import { readFileSync } from "fs"
import { Connection, createPool } from "mariadb"

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

        console.log("Connected to database")
    }

    getPlayerDataByName(name: string): Promise<PlayerData> {
        return new Promise(async (resolve, reject) => {
            const connection: Connection = await this.pool.getConnection()
            const result = await connection.query(
                "SELECT * FROM players WHERE name = ?",
                [name]
            )
            connection.end()
            if (result.length == 0) return reject("Player not found")
            const playerData: PlayerData = {
                uuid: result[0].uuid,
                username: result[0].name,
                nickname: result[0].nickname,
                timesjoined: result[0].timesjoined,
                playtime: result[0].playtime,
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

    getPlayerDataByUUID(uuid: string): Promise<PlayerData> {
        return new Promise(async (resolve, reject) => {
            const connection: Connection = await this.pool.getConnection()
            const result = await connection.query(
                "SELECT * FROM players WHERE uuid = ?",
                [uuid]
            )
            connection.end()
            if (result.length == 0) return reject("Player not found")
            const playerData: PlayerData = {
                uuid: result[0].uuid,
                username: result[0].name,
                nickname: result[0].nickname,
                timesjoined: result[0].timesjoined,
                playtime: result[0].playtime,
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

    getLinkDataByDiscord(discordId: string): Promise<LinkData | undefined> {
        return new Promise(async (resolve, reject) => {
            const connection: Connection = await this.pool.getConnection()
            const result = await connection.query(
                "SELECT * FROM link WHERE dscid = ?",
                [discordId]
            )
            connection.end()
            if (result.length == 0) return resolve(undefined)
            const linkData: LinkData = {
                uuid: result[0].uuid,
                discordId: result[0].dscid
            }
            resolve(linkData)
        })
    }

    getLinkDataByUUID(uuid: string): Promise<LinkData | undefined> {
        return new Promise(async (resolve, reject) => {
            const connection: Connection = await this.pool.getConnection()
            const result = await connection.query(
                "SELECT * FROM link WHERE uuid = ?",
                [uuid]
            )
            connection.end()
            if (result.length == 0) return resolve(undefined)
            const linkData: LinkData = {
                uuid: result[0].uuid,
                discordId: result[0].dscid
            }
            resolve(linkData)
        })
    }

    getPlayerStats(uuid: string): Promise<PlayerStats> {
        return new Promise(async (resolve, reject) => {
            const connection: Connection = await this.pool.getConnection()
            const result = await connection.query(
                "SELECT * FROM stats WHERE uuid = ?",
                [uuid]
            )
            connection.end()
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
    playtime: number
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
