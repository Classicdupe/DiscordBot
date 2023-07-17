import { PermissionFlagsBits, PermissionsBitField, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export default [
    {
        global: true,
        slash: new SlashCommandBuilder()
        .setName("link")
        .setDescription("To link your minecraft account")
        .addStringOption(option => 
            option
                .setName("code")
                .setDescription("The link code you were provided")
                .setRequired(true)
        )
        .toJSON()
    },
    {
        global: true,
        slash: new SlashCommandBuilder()
            .setName("unlink")
            .setDescription("To unlink your discord account")
            .toJSON()
    },
    {
        global: false,
        slash: new SlashCommandBuilder()
        .setName("execute")
        .setDescription("To execute a console command")
        .addStringOption(option => 
            option
                .setName("command")
                .setDescription("The command you would like to execute")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .toJSON()
    }
]

export interface ExternalCommand {
    global: boolean
    slash: RESTPostAPIChatInputApplicationCommandsJSONBody
}