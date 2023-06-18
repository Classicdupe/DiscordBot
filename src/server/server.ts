import { EventEmitter, WebSocket, WebSocketServer } from "ws";
import { parse } from 'url';
import { ProxyConnection } from "./proxy";
import { DataHandler, SimplePlayerData } from "./data/data";
import searchForFiles from "../utils/searchForFiles";
import { ConnectionClient } from "./client";

export class Server extends EventEmitter {

    private wss: WebSocketServer;

    private clients: WebSocket[] = [];
    private proxies: ProxyConnection[] = [];

    private dataHandlers: Map<number, DataHandler> = new Map();

    constructor() {
        super();
        console.log('Server starting...');

        this._loadDataHandlers();

        this.wss = new WebSocketServer({
            port: parseInt(process.env.PORT || "8080")
        })

        this.wss.on('connection', (ws) => {
            this._handleConnection(ws);
        })
    }

    public getPlayerCount(): number {
        let count: number = 0;
        this.proxies.forEach((proxy) => count += proxy.playerCount);
        return count;
    }

    public reloadDataHandlers() {
        this.dataHandlers.clear();
        this._loadDataHandlers();
    }

    public updateAllPlayerCounts() {
        let playerCount: number = 0;
        let players: SimplePlayerData[] = [];
        this.proxies.forEach((proxy) => {
            playerCount += proxy.playerCount;
            players = players.concat(proxy.players);
        });
        this.proxies.forEach((proxy) => proxy.updatePlayerCount(playerCount, players));
    }

    private _handleConnection(ws: WebSocket) {
        this.clients.push(ws);
        ws.on('close', () => this.clients.splice(this.clients.indexOf(ws), 1))
        
        let connectionClient: ConnectionClient;
        const url = parse(ws.url || "", true);
        if(url.pathname == "/proxy") {
            const proxy = new ProxyConnection(ws);
            this.proxies.push(proxy);
            connectionClient = proxy;
        } else {
            ws.close(321);
            return;
        }

        connectionClient.updateDataHandlers(this.dataHandlers);
    }

    private _loadDataHandlers() {
        searchForFiles("./data").forEach((file: string) => {
            const handler = require(file).default;
            try {
                const code = parseInt(file.split("/").pop()?.split(".")[0] || "notACode");
                this.dataHandlers.set(code, new handler());
            } catch(e) {}
        });
    }

}