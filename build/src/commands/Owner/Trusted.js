import { addTrusted, checkTrusted, listTrusted, removeTrusted, } from "../../wrapper/db/management.js";
import OrasCommand from "../../abstract/OrasCommand.js";
export default class Trusted extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "trusted";
        this.aliases = [];
        this.cat = "trusted";
        this.dev = true;
        this.exec = async (message, args, prefix) => {
            if (!args[0])
                return message.reply({
                    embeds: [
                        this.client.utils
                            .embed()
                            .setTitle(`<:icons_verified:1205135334841516089> Trusted Subcommands`)
                            .setDescription(`<:white_arrow:1204737655716315178>\`${prefix}trusted add\`\nAdds a user to trusted commands\n\n<:white_arrow:1204737655716315178>\`${prefix}trusted remove\`\nRemoves a user from trusted commands\n\n<:white_arrow:1204737655716315178>\`${prefix}trusted list\`\nShows the list of the trusted command users`)
                            .setTimestamp()
                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true })),
                    ],
                });
            if (args[0].toLowerCase() === `add`) {
                let user;
                if (message.mentions.users
                    .filter((x) => x !== this.client.user)
                    .first())
                    user = message.mentions.users
                        .filter((x) => x !== this.client.user)
                        .first();
                else if (args[1])
                    user = await this.client.users.fetch(args[1]);
                if (!user)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setDescription(`<:icons_cross:1204719930046423050> Please provide me a valid user!`),
                        ],
                    });
                if (checkTrusted(user.id) === true)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setDescription(`<:icons_cross:1204719930046423050> This User is already present in Trusted's List`),
                        ],
                    });
                else {
                    addTrusted(user.id);
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .successEmbed()
                                .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Added** ${user.tag} to my **Trusted's List**`),
                        ],
                    });
                }
            }
            else if (args[0].toLowerCase() === `remove`) {
                let user;
                if (message.mentions.users
                    .filter((x) => x !== this.client.user)
                    .first())
                    user = message.mentions.users
                        .filter((x) => x !== this.client.user)
                        .first();
                else if (args[1])
                    user = await this.client.users.fetch(args[1]);
                if (!user)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setDescription(`<:icons_cross:1204719930046423050> Please provide me a valid user!`),
                        ],
                    });
                if (checkTrusted(user.id) === false)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setDescription(`<:icons_cross:1204719930046423050> This User is not present in Trusted's List`),
                        ],
                    });
                else {
                    removeTrusted(user.id);
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .successEmbed()
                                .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Removed** ${user.tag} from my Trusted's List`),
                        ],
                    });
                }
            }
            else if (args[0].toLowerCase() === `list`) {
                let lol = [];
                let list = listTrusted();
                let us;
                for (let i = 0; i < list.length; i++) {
                    us = await this.client.users.fetch(list[i]);
                    lol.push(`**(${i + 1})** [${us.tag}](${this.client.config.server}) [ID: ${us.id}]`);
                }
                return message.reply({
                    embeds: [
                        this.client.utils
                            .embed()
                            .setDescription(list.length ? lol.sort().join("\n") : "No Users")
                            .setTitle(`<:icons_verified:1205135334841516089> Trusted List`),
                    ],
                });
            }
        };
    }
}
//# sourceMappingURL=Trusted.js.map