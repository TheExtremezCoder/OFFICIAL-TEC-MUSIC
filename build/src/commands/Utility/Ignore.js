import OrasCommand from "../../abstract/OrasCommand.js";
export default class Ignore extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "ignore";
        this.aliases = ["ign"];
        this.desc = "Configures Ignore module for command or bypass of the bot";
        this.usage = "ignore <command> [channel]";
        this.cat = "utility";
        this.dev = false;
        this.manage = false;
        this.premium = {
            guild: false,
            user: false,
        };
        this.exec = async (message, args, prefix) => {
            if (!message.member.permissions.has("ManageGuild") &&
                !client.config.owners.includes(message.author.id) &&
                this.client.utils.checkActivator(message.guild.id) !== message.author.id)
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:icons_cross:1204719930046423050> You don't have **Manage Guild** permissions to use this command`)
                    ],
                });
            if (!args[0])
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setTitle(`<:ignore:1205383713324802129> Ignore Subcommands`)
                            .setDescription(`<:white_arrow:1204737655716315178>\`${prefix}ignore add <channel>\`\nAdds a channel to the ignore list\n\n<:white_arrow:1204737655716315178>\`${prefix}ignore remove <channel>\`\nRemoves a channel from ignore list\n\n<:white_arrow:1204737655716315178>\`${prefix}ignore config\`\nShows the config for the ignore list\n\n<:white_arrow:1204737655716315178>\`${prefix}ignore bypass <mods/admins>\`\nAdds mods or admins to ignore bypass\n\n<:white_arrow:1204737655716315178>\`${prefix}ignore reset\`\nResets the ignore settings for the guild`)
                            .setTimestamp(),
                    ],
                });
            if (args[0].toLowerCase() === `add`) {
                let channel = message.mentions.channels.first() ||
                    message.guild.channels.cache.get(args[1]);
                if (!channel)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setDescription(`<:icons_cross:1204719930046423050> Please provide me a valid channel`),
                        ],
                    });
                if (this.client.utils.checkIgnore(message.guildId, channel.id))
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setDescription(`<:icons_cross:1204719930046423050> This Channel ${channel} is Already in my Ignore List!`),
                        ],
                    });
                let list = this.client.utils.getIgnoreList(message.guildId);
                if (list.length >= 5 &&
                    !this.client.utils.checkServerPrem(message.guild.id) &&
                    !this.client.utils.checkServerPremStatus(message.guldId))
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setDescription(`<:icons_cross:1204719930046423050> This guilds need to be a **[Premium Guild](${this.client.config.server})** in order to add more than **5 Channels in Ignore List**`)
                        ],
                    });
                this.client.utils.addIgnore(message.guildId, channel.id);
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Added** ${channel} to the Ignore List! Now I will Ignoring all of my Commands There!`)
                    ],
                });
            }
            if (args[0].toLowerCase() === `remove`) {
                let channel = message.mentions.channels.first() ||
                    message.guild.channels.cache.get(args[1]);
                if (!channel)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setDescription(`<:icons_cross:1204719930046423050> Please provide me a valid channel!`),
                        ],
                    });
                if (!this.client.utils.checkIgnore(message.guildId, channel.id))
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setDescription(`<:icons_cross:1204719930046423050> This Channel ${channel} is not present in my Ignore List!`),
                        ],
                    });
                this.client.utils.removeIgnore(message.guildId, channel.id);
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Removed** ${channel} from my Ignore List!`)
                    ],
                });
            }
            if (args[0].toLowerCase() === `config`) {
                let stats = [];
                let list = this.client.utils.getIgnoreList(message.guildId);
                let em = this.client.utils
                    .premiumEmbed(message.guildId)
                    .setTitle(`Guild's Ignore Config`)
                    .setFooter({
                    text: `Requested By: ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                });
                let ch;
                for (let i = 0; i < list.length; i++) {
                    try {
                        ch = await message.guild.channels.fetch(list[i]);
                        stats.push(`**${i + 1}.** [${ch.name}](${this.client.config.voteUrl}) [ID: ${ch.id}]`);
                    }
                    catch (e) {
                        this.client.utils.removeIgnore(message.guild.id, list[i]);
                    }
                }
                em.setDescription(stats.length
                    ? stats.sort().join("\n")
                    : "None of the Channels have been Ignored")
                    .addFields([
                    {
                        name: `Bypass Admins?`,
                        value: `${this.client.utils.checkBypassAdmins === true
                            ? `<:Check_Icon:1204720507623178290> True`
                            : `<:icons_cross:1204719930046423050> False`}`,
                        inline: true,
                    },
                    {
                        name: `Bypass Mods?`,
                        value: `${this.client.utils.checkBypassMods === true
                            ? `<:Check_Icon:1204720507623178290> True`
                            : `<:icons_cross:1204719930046423050> False`}`,
                        inline: true,
                    },
                ])
                    .setThumbnail(message.guild.iconURL({ dynamic: true }));
                return message.reply({
                    embeds: [em],
                });
            }
            if (args[0].toLowerCase() === `bypass`) {
                if (!args[1]) {
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setDescription(`<:white_arrow:1204737655716315178>\`${prefix}ignore bypass admins\`\nToggles Bypass for the server admins\n\n<:white_arrow:1204737655716315178>\`${prefix}ignore bypass mods\`\nToggles Bypass for the server mods`)
                                .setTitle(`<:ignore:1205383713324802129> \`${prefix}ignore bypass\``)
                                .setThumbnail(this.client.user.displayAvatarURL()),
                        ],
                    });
                }
                if (args[1].toLowerCase() === `admins`) {
                    let check = this.client.utils.checkBypassAdmins(message.guildId);
                    if (check === true) {
                        this.client.utils.removeBypassAdmins(message.guildId);
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guildId)
                                    .setDescription(`<:icons_cross:1204719930046423050> **Removed** Admins from my **Ignore Bypass**`),
                            ],
                        });
                    }
                    else {
                        this.client.utils.addBypassAdmins(message.guildId);
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guildId)
                                    .setDescription(`<:Check_Icon:1204720507623178290> **Added** Admins to **Ignore Bypass**`),
                            ],
                        });
                    }
                }
                if (args[1].toLowerCase() === `mods`) {
                    let check = this.client.utils.checkBypassMods(message.guildId);
                    if (check === true) {
                        this.client.utils.removeBypassMods(message.guildId);
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guildId)
                                    .setDescription(`<:icons_cross:1204719930046423050> **Removed** Mods from my **Ignore Bypass**`),
                            ],
                        });
                    }
                    else {
                        this.client.utils.addBypassMods(message.guildId);
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guildId)
                                    .setDescription(`<:Check_Icon:1204720507623178290> **Added** Mods to my **Ignore Bypass**`),
                            ],
                        });
                    }
                }
            }
            if (args[0].toLowerCase() === `reset`) {
                this.client.utils.resetIgnore(message.guildId);
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Resetted** the Ignore Module!`),
                    ],
                });
            }
        };
    }
}
//# sourceMappingURL=Ignore.js.map