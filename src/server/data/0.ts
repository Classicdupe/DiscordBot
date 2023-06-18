import { ProxyConnection } from "../proxy";
import { DataHandler, RawData, SimplePlayerData } from "./data";

/**
 * Code 0
 * PlayerCountUpdateData
 * 
 * Sent by the proxy to the server to update the player count
 */

export default class PlayerCouuntUpdateHandler implements DataHandler {
    handle(proxy: ProxyConnection, data: PlayerCountUpdateServer): void {
        proxy.playerCount = data.data.playerCount;
        proxy.players = data.data.playrs;
    }
}

export interface PlayerCountUpdateServer extends RawData {
    code: 0;
    data: {
        playerCount: number;
        playrs: SimplePlayerData[];
    };
}

export interface PlayerCountUpdateClient extends RawData {
    code: 0;
    data: {
        playerCount: number;
        players: SimplePlayerData[];
    };
}