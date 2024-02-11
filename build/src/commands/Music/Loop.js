import OrasCommand from "../../abstract/OrasCommand.js";
export default class Loop extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "loop";
        this.aliases = [];
        this.desc = "Sets the loop mode of the player";
        this.usage = "loop <off/track/queue>";
        this.cat = "music";
        this.dev = false;
        this.vc = true;
        this.samevc = true;
        this.dispatcher = true;
        this.playing = true;
        this.vote = false;
        this.exec = async (message, args, prefix, dispatcher) => {
            if (!args[0])
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guild.id)
                            .setTitle(`<:icons_loop:1205125247070900314> Loop Subcommands`)
                            .setDescription(`** <:white_arrow:1204737655716315178>\`${prefix}loop off\`\nDisabled the loop mode for the player\n\n<:white_arrow:1204737655716315178>\`${prefix}loop track\`\nSets Loop mode for the player to Track\n\n<:white_arrow:1204737655716315178>\`${prefix}loop queue\`\nSets Loop mode for the player to Queue**`)
                            .setTimestamp(),
                    ],
                });
            if (args[0].toLowerCase() === `off` ||
                args[0].toLowerCase() === `disable`) {
                dispatcher.repeat = "off";
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Updated** Loop mode of the player to **Off**`)
                    ],
                });
            }
            if (args[0].toLowerCase() === `track` ||
                args[0].toLowerCase() === `song` ||
                args[0].toLowerCase() === `current`) {
                dispatcher.repeat = "one";
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Updated** Loop mode of the player to **Track**`)
                    ],
                });
            }
            if (args[0].toLowerCase() === `all` ||
                args[0].toLowerCase() === `queue`) {
                dispatcher.repeat = "all";
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Updated** Loop mode of the player to **Queue**`)
                    ],
                });
            }
            else {
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guild.id)
                            .setTitle(`<:icons_loop:1205125247070900314> Loop Subcommands`)
                            .setDescription(`<:white_arrow:1204737655716315178>\`${prefix}loop off\`\nDisabled the loop mode for the player\n\n<:white_arrow:1204737655716315178>\`${prefix}loop track\`\nSets Loop mode for the player to Track\n\n<:white_arrow:1204737655716315178>\`${prefix}loop queue\`\nSets Loop mode for the player to Queue`)
                            .setTimestamp(),
                    ],
                });
            }
        };
    }
}
//# sourceMappingURL=Loop.js.map