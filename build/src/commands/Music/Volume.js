import OrasCommand from "../../abstract/OrasCommand.js";
export default class OrasVolume extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "volume";
        this.aliases = ["vol"];
        this.cat = "music";
        this.dev = false;
        this.manage = false;
        this.desc = "Controls the volume of the player";
        this.usage = "volume <number>";
        this.vc = true;
        this.samevc = true;
        this.premium = {
            guild: false,
            user: false,
        };
        this.exec = async (message, args, prefix) => {
            const dispatcher = this.client.api.get(message.guildId);
            if (!dispatcher || !dispatcher.player)
                return message.reply({
                    embeds: [
                        this.client.utils
                            .errorEmbed()
                            .setDescription(`<:icons_cross:1204719930046423050> There is no player for this guild yet`),
                    ],
                });
            if (!args[0]) {
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`Current Volume of the player is set to: **${Math.round(dispatcher.player.filters.volume * 100)}**`),
                    ],
                });
            }
            if (!Number(args[0]) || Number(args[0]) < 0 || Number(args[0]) > 200)
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:icons_cross:1204719930046423050> Volume arguement must lie betwwen **0 to 200**`)
                    ],
                });
            let vol = Math.round(Number(args[0]) / 100);
            if (Math.round(vol / 100) === dispatcher.player.filters.volume)
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:icons_cross:1204719930046423050> Volume is Already set to **${vol}%**`),
                    ],
                });
            await dispatcher.player.setVolume(vol);
            return message.reply({
                embeds: [
                    this.client.utils
                        .premiumEmbed(message.guildId)
                        .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Changed** the Volume to **${args[0]}%**`)
                ],
            });
        };
    }
}
//# sourceMappingURL=Volume.js.map