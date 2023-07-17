export class MinehutApiCommunicator {
    sessionId: string
    sessionToken: string
    profileId: string

    constructor() {
        if (!process.env.MH_SESSIONID)
            throw new Error("MH_SESSIONID not found in .env")
        if (!process.env.MH_SESSIONTOKEN)
            throw new Error("MH_SESSIONTOKEN not found in .env")
        if (!process.env.SLG_TOKEN)
            throw new Error("SLG_TOKEN not found in .env")
        this.sessionId = process.env.MH_SESSIONID
        this.sessionToken = process.env.MH_SESSIONTOKEN
        this.profileId = process.env.SLG_TOKEN
    }

    async getServerData(serverId: string): Promise<any> {
        const data = await fetch(`https://api.minehut.com/v2/admin/users`, {
            headers: {
                "X-Profile-Id": this.profileId,
                "X-Session-Id": this.sessionId,
                Authorization: "Bearer " + this.sessionToken
            }
        }).then((res) => res.json())

        console.log(data)
        return data
    }
}
