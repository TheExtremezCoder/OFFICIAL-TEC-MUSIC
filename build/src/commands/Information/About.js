import OrasCommand from "../../abstract/OrasCommand.js";
export default class About extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "about";
        this.desc = "Provides you with the information of the bot";
        this.usage = "about";
        this.aliases = [];
        this.cat = "info";
        this.exec = async (message, args, prefix) => {
            return message
                    .reply({
                    embeds: [
                        this.client.utils
                            .embed()
                            .setAuthor({
                                name: `${message.author.username}`,
                                iconURL: message.author.displayAvatarURL(),
                            })
                            .setTitle(`<:user:1204719348594253844> About`)
                            .setDescription(`***Hey, It's*** __**${client.user.username}**__ ***A Quality Music Bot With Breathtaking Features For Greater Experience While On Discord.*** __**${client.user.username}**__ ***Is Making Music More Enhanced In Discord. Try*** __**${client.user.username}**__ ***Now!***`)                            .setFooter({
                                text: `Thanks For Selecting ${this.client.user.username}`,
                                iconURL: this.client.user.displayAvatarURL({ dynamic: true }),
                            }),
                    ],
                    components: [
                        this.client.utils.actionRow([
                            this.client.utils.button(`link`, `Invite Me`, null, null, `${this.client.config.botinvite}`),
                            this.client.utils.button(`link`, `Support`, null, null, `${this.client.config.server}`),
                            this.client.utils.button(`link`, `Premium`, null, null, `${this.client.config.server}`),
                        ]),
                    ],
                })
        };
    }
}
//# sourceMappingURL=About.js.map