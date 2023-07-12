import { Client, IntentsBitField, Role } from "discord.js"

const bot =  new Client({
    intents: [
        IntentsBitField.Flags.AutoModerationConfiguration,
        IntentsBitField.Flags.AutoModerationExecution,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.DirectMessageTyping,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildInvites,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent
    ]
})

bot.on("ready", () => {

    const role: Role = bot.guilds.cache.find(guild => guild.id === "1068991438391623836")?.roles.cache.find(role => role.id === "1127725263363518555")!;

    bot.guilds.cache.find(guild => guild.id === "1068991438391623836")?.members.cache.sort((a, b) => (a.joinedAt != null ? a.joinedAt.getTime() : 0) - (b.joinedAt != null ? b.joinedAt.getTime() : 0)).first(58).forEach(member => {
        console.log("Member: " + member.user.username);
        if(!member.user.bot) {
            member.roles.add(role)
        }
    })
});

bot.login("").then(() =>
    console.log("ClassicDupe Application bot is now online")
)