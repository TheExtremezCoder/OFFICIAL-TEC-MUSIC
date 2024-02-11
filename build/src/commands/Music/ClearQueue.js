import OrasCommand from "../../abstract/OrasCommand.js";
export default class ClearQueue extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "clearqueue";
        this.aliases = ["clear"];
        this.desc = "Cleares the queue of the player";
        this.usage = "clearqueue";
        this.cat = "music";
        this.vc = true;
        this.samevc = true;
        this.vote = false;
        this.manage = false;
        this.dev = false;
        this.dispatcher = true;
        this.exec = async (message, args, prefix, dispatcher) => {
            if (!dispatcher.queue.length)
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guild.id)
                            .setDescription(`<:icons_cross:1204719930046423050> There are **No Songs** in the queue to **Cleared**`),
                    ],
                });
            else {
                await dispatcher.queue.splice(0);
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Cleared** the Player Queue`),
                    ],
                });
            }
        };
    }
}
//# sourceMappingURL=ClearQueue.js.map