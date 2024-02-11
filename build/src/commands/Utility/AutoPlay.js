import OrasCommand from "../../abstract/OrasCommand.js";
export default class AutoPlay extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "autoplay";
        this.aliases = ["ap"];
        this.cat = "utility";
        this.vc = true;
        this.samevc = true;
        this.desc = "Toggles autoplay mode of the player";
        this.usage = "autoplay [on/enable | off/disable]";
        this.vote = false;
        this.manage = false;
        this.dev = false;
        this.premium = {
            guild: false,
            user: false,
        };
        this.exec = async (message, args, prefix) => {
            if (!args[0]) {
                let update = this.client.utils.updateAutoPlay(message.guild.id);
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guild.id)
                            .setDescription(`${update === true
                            ? '<:Check_Icon:1204720507623178290>'
                            : '<:icons_cross:1204719930046423050>'} Successfully **${update === true ? `Enabled` : `Disabled`} AutoPlay Mode** of ${this.client.user.username} `)
                            .setTimestamp()
                    ],
                });
            }
            else if (args[0].toLowerCase() === `on` ||
                args[0].toLowerCase() === `enable`) {
                if (this.client.utils.getAutoPlay(message.guild.id) === true)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guild.id)
                                .setDescription(`<:icons_cross:1204719930046423050> **AutoPlay Mode** is Already **Enabled**`)
                                .setTimestamp(),
                        ],
                    });
                this.client.utils.updateAutoPlay(message.guild.id);
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Enabled AutoPlay Mode** of ${this.client.user.username}`),
                    ],
                });
            }
            else if (args[0].toLowerCase() === `off` ||
                args[0].toLowerCase() === `disable`) {
                if (this.client.utils.getAutoPlay(message.guild.id) === false)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guild.id)
                                .setDescription(`<:icons_cross:1204719930046423050> **AutoPlay Mode** is Already **Disabled**`)
                                .setTimestamp(),
                        ],
                    });
                this.client.utils.updateAutoPlay(message.guild.id);
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Disabled AutoPlay Mode** of ${this.client.user.username}`),
                    ],
                });
            }
            else {
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:white_arrow:1204737655716315178>\`${prefix}autoplay [on/enable]\`\nEnables AutoPlay mode of the Player\n\n<:white_arrow:1204737655716315178>\`${prefix}autoplay [off/disable]\`\nDisables AutoPlay mode of the Player`)
                            .setTitle(`<:autoplay:1205137790623420418> AutoPlay Subcommands`),
                    ],
                });
            }
        };
    }
}
//# sourceMappingURL=AutoPlay.js.map