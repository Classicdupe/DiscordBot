import { config } from "dotenv";
import { DiscordBot } from "./bot/bot";
import { Database } from "./database/database";
import * as readline from 'node:readline/promises';
import { Server } from "./server/server";

config({
    path: "../../resources/.env"
})

console.log("Connecting to the database...")
const database = new Database()
console.log("Connected to the database")

console.log("Starting websocket server...")
const server = new Server()
console.log("Started websocket server")

console.log("Starting the discord bot...")
const bot = new DiscordBot(database, server)
console.log("Discord bot started")

const rl = readline.createInterface(process.stdin, process.stdout);

(async () => {
    while(true) {
        const command = await rl.question("> ");
        switch(command.toLowerCase()) {
            case "exit": {
                process.exit(0)
            }
        }
    }
})()