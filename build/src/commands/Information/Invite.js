import OrasCommand from "../../abstract/OrasCommand.js";
export default class Invite extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "invite";
        this.aliases = ["inv"];
        this.desc = "Provides you with the Invite link of the bot";
        this.usage = "invite";
        this.cat = "info";
        this.exec = async (message, args, prefix) => {
            return message.reply({
                content: `Here You Go!`,
                components: [
                    this.client.utils.actionRow([
                        this.client.utils.button(`link`, `Invite Me`, null, null, `${this.client.config.botinvite}`, '<:icons_invite:1204747632111788043>'),
                        this.client.utils.button(`link`, `Support Server`, null, null, `${this.client.config.server}`, '<:server:1204749667632554004>'),
                    ]),
                ],
            });
        };
    }
}
//# sourceMappingURL=Invite.js.map