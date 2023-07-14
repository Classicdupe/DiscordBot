import { MinehutApiCommunicator } from "./utils/minehutApiCommunicator";
import fs from "fs"
import dotenv from "dotenv"

dotenv.config({
    path: "./../resources/.env"
})

const mh = new MinehutApiCommunicator()

mh.getServerData("5eefe0d11e06f5006ab0e75a")