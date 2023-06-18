import { Data, WebSocket } from "ws";
import { DataHandler, RawData, SimplePlayerData } from "./data/data";
import { PlayerCountUpdateClient } from "./data/0";
import { ConnectionClient } from "./client";

export class ProxyConnection extends ConnectionClient {

    private ws: WebSocket;

    public playerCount: number = 0;
    public players: SimplePlayerData[] = [];

    constructor(ws: WebSocket) {
        super();
        this.ws = ws;

        this.ws.on("message", (msg) => this._handleMessage(msg.toString()))
    }

    public updatePlayerCount(count: number, players: SimplePlayerData[]) {
        const data: PlayerCountUpdateClient = {
            code: 0,
            data: {
                playerCount: count,
                players: players
            }
        }
        this.sendRawData(data);
    }

    public sendRawData(data: RawData) {
        this.ws.send(JSON.stringify(data));
    }

    private _handleMessage(msg: string) {
        let da: RawData;

        try {
            da = JSON.parse(msg);
        } catch (e) {
            console.log("JSON parse error in proxy message");
            return;
        }

        

    }

}