import { EmbedBuilder } from "discord.js";
import OrasCommand from "../../abstract/OrasCommand.js";
import { removeUserPrem } from "../../wrapper/db/premium.js";
export default class RemovePremium extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "removePremium";
        this.aliases = ["removepremium", "removeprem", "-prem"];
        this.cat = "dev";
        this.manage = true;
        this.dev = false;
        this.desc = "Removes the premium from a user by the management";
        this.usage = "removePremium <user>";
        this.exec = async (message, args, prefix) => {
            if (!args[0])
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setAuthor({
                            name: `${this.client.user.username}`,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                            .setDescription(`### \`removePremium <userID/serverID>\``),
                    ],
                });
            let user;
            if (message.mentions.users
                .filter((x) => x !== this.client.user)
                .first())
                user = message.mentions.users
                    .filter((x) => x !== this.client.user)
                    .first();
            else if (args[0])
                user = await this.client.users.fetch(args[0]);
            if (!user || user === undefined)
                return message.reply({
                    embeds: [
                        this.client.utils
                            .errorEmbed()
                            .setAuthor({
                            name: `${this.client.user.username}`,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                            .setDescription(`<:icons_cross:1204719930046423050> Please provide me a valid user`),
                    ],
                });
            let check = this.client.utils.checkUserPrem(user.id);
            if (check === false)
                return message.reply({
                    embeds: [
                        this.client.utils
                            .errorEmbed()
                            .setDescription(`<:icons_cross:1204719930046423050> This user ${user.tag} is not a Premium User!`),
                    ],
                });
            else {
                let rem = removeUserPrem(user.id);
                if (rem === true) {
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .successEmbed()
                                .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Removed** [Premium](${this.client.config.server}) from **${user.tag}**`)
                                .setTimestamp()
                                .setAuthor({
                                name: `${this.client.user.username}`,
                                iconURL: this.client.user.displayAvatarURL(),
                            }),
                        ],
                    });
                }
            }
        };
    }
}
//# sourceMappingURL=RemovePremium.js.map