import { Message } from "discord.js"
import { ClassicClient } from ".."

module.exports = async (client: ClassicClient, msg: Message) => {
    if (msg.author.bot) return
    if (!msg.content.startsWith("!")) return
    const cmd = msg.content.slice(1).trim().split(/ +/g)[0]
    const args = msg.content.slice(1).trim().split(/ +/g).slice(1)

    const command = client.commandLoader.getCommand(cmd)
    if (command && command.execute != undefined)
        command.execute(client, msg, args)
}