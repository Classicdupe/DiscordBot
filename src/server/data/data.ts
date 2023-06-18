import { ProxyConnection } from "../proxy";

export interface RawData {
    code: number;
    data: any;
}

export interface DataHandler {
    handle(proxy: ProxyConnection, data: RawData): void;
}

export interface SimplePlayerData {
    name: string;
    uuid: string;
}