import { DataHandler } from "./data/data";

export class ConnectionClient {
    protected dataHandlers: Map<number, DataHandler> = new Map();

    public updateDataHandlers(dataHandlers: Map<number, DataHandler>) {
        this.dataHandlers = dataHandlers;
    }
}