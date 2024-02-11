import { addServerPrem, decretCount, getActivator, getCount, getPremServerList, getPremTime, getServerPremiumStatus, getUserCode, getUserPremStatus, getUserPremtier, incrementCount, removeServerPrem, } from "../../wrapper/db/premium.js";
import OrasCommand from "../../abstract/OrasCommand.js";
import { manageMent } from "../../wrapper/db/management.js";
export default class Premium extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "premium";
        this.aliases = ["prem"];
        this.cat = "utility";
        this.desc = "Toggles premium cateogry for the bot";
        this.usage = "premium <activate/revoke/status>";
        this.dev = false;
        this.manage = false;
        this.vc = false;
        this.samevc = false;
        this.exec = async (message, args, prefix) => {
            if (!args[0] ||
                !["status", "activate", "stats", "revoke"].includes(args[0].toLowerCase()))
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setTitle(`<:Icon_Premium:1204719583982911509> Premium Subcommands`)
                            .setAuthor({
                            name: `${this.client.user?.username}`,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                            .setDescription(`<:white_arrow:1204737655716315178>\`${prefix}premium activate\`\nActivates the premium for a server\n\n<:white_arrow:1204737655716315178>\`${prefix}premium status\`\nShows the premium statistics for a user\n\n<:white_arrow:1204737655716315178>\`${prefix}premium revoke\`\n\Revokes the premium of the user`),
                    ],
                });
            if (args[0].toLowerCase() === `activate`) {
                let check = getUserPremStatus(message.author.id);
                if (check.USER === null)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setDescription(`<:icons_cross:1204719930046423050> You don't have any kind of **[Premium](${this.client.config.server})** to be activated!`)
                                .setAuthor({
                                name: `${this.client.user.username}`,
                                iconURL: this.client.user.displayAvatarURL(),
                            })
                                .setTimestamp()
                                .setTitle(`<:icons_cross:1204719930046423050> Premium Not Found <:Icon_Premium:1204719583982911509>`),
                        ],
                    });
                let cnt = getCount(message.author.id);
                if (cnt.COUNT === 0)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setDescription(`<:icons_cross:1204719930046423050> You don't have any **[Premiums](${this.client.config.server})** left to be activated`)
                                .setTimestamp()
                                .setTitle(`<:icons_cross:1204719930046423050> Premiums Not Avaialable <:Icon_Premium:1204719583982911509>`),
                        ],
                    });
                let time = getPremTime(message.author.id);
                if (time.TIME === 0) {
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setTimestamp()
                                .setTitle(`<:icons_cross:1204719930046423050> Premium Expired <:Icon_Premium:1204719583982911509>`)
                                .setDescription(`<:icons_cross:1204719930046423050> Your [Premium](${this.client.config.server}) has been **Expired**`),
                        ],
                    });
                }
                let status = getServerPremiumStatus(message.guildId);
                if (status.STATUS === 1) {
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setTimestamp()
                                .setTitle(`<:server:1204749667632554004> Premium Server <:Icon_Premium:1204719583982911509>`)
                                .setDescription(`<:icons_cross:1204719930046423050> This Server is already in my Premium`),
                        ],
                    });
                }
                let guild = message.guild;
                let code = getUserCode(message.author.id);
                if (code.CODE === null)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setTimestamp()
                                .setTitle(`<:icons_cross:1204719930046423050> Premium Code Unavailable <:Icon_Premium:1204719583982911509>`)
                                .setDescription(`<:icons_cross:1204719930046423050> You premium Code seems not to be working! Please contact the support`),
                        ],
                    });
                let premTime = time.TIME ? time.TIME : 0;
                let cd = this.client.utils.genPremId();
                let add = addServerPrem(message.author.id, premTime, guild.id, cd);
                if (add === true) {
                    decretCount(message.author.id);
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .successEmbed()
                                .setTimestamp()
                                .setTitle(`<:Check_Icon:1204720507623178290> Premium Added<:Icon_Premium:1204719583982911509> `)
                                .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Added** [Premium](${this.client.config.server}) to ${guild.name} by **${message.author.tag}**\nExpires On: <t:${premTime}> (<t:${premTime}:R>)\nExecutive Code: \`${code.CODE}\``),
                        ],
                    });
                }
            }
            if (args[0].toLowerCase() === `status` ||
                args[0].toLowerCase() === `stats`) {
                let user;
                if (message.mentions.users
                    .filter((x) => x !== this.client.user)
                    .first())
                    user = message.mentions.users
                        .filter((x) => x !== this.client.user)
                        .first();
                else if (args[1])
                    user = await this.client.users.fetch(args[1]);
                else if (!args[1])
                    user = message.author;
                if (!user)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setDescription(`<:icons_cross:1204719930046423050> Please provide me a valid User!`),
                        ],
                    });
                let sel = this.client.utils.checkUserPrem(user.id);
                if (sel === false)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setTitle(`<:icons_cross:1204719930046423050> Premium Not Found <:Icon_Premium:1204719583982911509>`)
                                .setDescription(`<:icons_cross:1204719930046423050> User ${user.tag} don't have any kind of [Premium](${this.client.config.server}).Please visit our [Support Server](${this.client.config.server}) to avail your Premium today!`)
                                .setTimestamp()
                                .setAuthor({
                                name: `${this.client.user.username}`,
                                iconURL: this.client.user.displayAvatarURL(),
                            }),
                        ],
                    });
                let stats = [];
                let um;
                let g;
                let list = getPremServerList(user.id);
                let cnt = getCount(user.id);
                let upgrades = list.length;
                let upgradesLeft = cnt.COUNT;
                let Tier;
                let tier = getUserPremtier(user.id);
                if (tier.TIER === "none" || tier.TIER === "unknown")
                    Tier = "Info Not Available";
                else if (tier.TIER === "bronze")
                    Tier = "Bronze Tier";
                else if (tier.TIER === "silver")
                    Tier = "Silver Tier";
                else if (tier.TIER === "gold")
                    Tier = "Gold Tier";
                else if (tier.TIER === "diamond")
                    Tier = "Diamond Tier";
                else if (tier.TIER === "special")
                    Tier = "Special Tier";
                else
                    Tier = "Info Not Available";
                for (let i = 0; i < list.length; i++) {
                    try {
                        g = await this.client.guilds.fetch(list[i]).catch(() => { });
                        um = this.client.utils.checkServerPremTime(list[i]);
                        stats.push(`**(No ${i + 1})** \nServer Name: \`${g.name}\`\nExpires On: <t:${this.client.utils.checkServerPremTime(list[i])}> (<t:${this.client.utils.checkServerPremTime(list[i])}:R>)`);
                    }
                    catch (e) {
                        this.client.utils.deleteServerPrem(list[i]);
                    }
                }
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setTitle(`<:Icon_Premium:1204719583982911509> Premium Stats`)
                            .setAuthor({
                            name: `${this.client.user.username}`,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                            .setDescription(`Premium Tier: \`${Tier}\`\nUsing Premium In: \`${upgrades}\` Servers\nUpgrades Left: \`${upgradesLeft}\`\n\n__Upgraded Servers:__\n${stats.length
                            ? stats.sort().join("\n\n")
                            : "No Premium Servers"}`),
                    ],
                });
            }
            if (args[0].toLowerCase() === `revoke`) {
                let check = this.client.utils.checkUserPrem(message.author.id);
                if (check === false) {
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setTitle(`<:icons_cross:1204719930046423050> Premium Not Found <:Icon_Premium:1204719583982911509>`)
                                .setDescription(`<:icons_cross:1204719930046423050> You don't have any kind of [Premium](${this.client.config.server}).Please visit our [Support Server](${this.client.config.server}) to avail your Premium today!`)
                                .setTimestamp()
                                .setAuthor({
                                name: `${this.client.user.username}`,
                                iconURL: this.client.user.displayAvatarURL(),
                            }),
                        ],
                    });
                }
                let guild = message.guild;
                if (this.client.utils.checkServerPrem(guild.id) === false &&
                    this.client.utils.checkServerPremStatus(guild.id) === false) {
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setTitle(`No Premium Found`)
                                .setDescription(`<:icons_cross:1204719930046423050> This guild: \`${guild.name}\` is not in my **[Premium](${this.client.config.server})** Guilds!`)
                                .setTimestamp(),
                        ],
                    });
                }
                if (this.client.utils.checkActivator(guild.id) !== message.author.id) {
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setTitle(`Not Activator`)
                                .setDescription(`<:icons_cross:1204719930046423050> You are not the activator for this guild's Premium`)
                                .setAuthor({
                                name: `${this.client.user.username}`,
                                iconURL: this.client.user.displayAvatarURL(),
                            })
                                .setTimestamp(),
                        ],
                    });
                }
                let rem = removeServerPrem(message.author.id, message.guildId);
                if (rem === true) {
                    incrementCount(message.author.id);
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .successEmbed()
                                .setTitle(`Premium Revoked`)
                                .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Revoked** [Premium](${this.client.config.server}) for the guild by **${message.author.tag}**`)
                                .setTimestamp(),
                        ],
                    });
                }
                else
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .errorEmbed()
                                .setDescription(`<:icons_cross:1204719930046423050> Please contact devs!`),
                        ],
                    });
            }
            if (args[0].toLowerCase() === 'activator') {
                if (manageMent(message.author.id).MANAGE === null && !this.client.config.owners.includes(message.author.id))
                    return;
                let guild;
                if (!args[1])
                    guild = message.guild;
                else if (args[1])
                    guild = await this.client.guilds.fetch(args[1]);
                if (!guild) {
                    return message.reply({
                        content: `<:icons_cross:1204719930046423050> Please provide me a valid Guild Id!`
                    });
                }
                let prem = this.client.utils.getServerPremiumStatus(guild.id);
                if (!prem)
                    return message.reply({
                        content: `<:icons_cross:1204719930046423050> That Guild is not a Premium Guild!`
                    });
                let get = getActivator(guild.id);
                if (get.USER !== null) {
                    let user = await this.client.users.fetch(get.USER);
                    return message.reply({
                        embeds: [
                            this.client.utils.premiumEmbed(guild.id)
                                .setDescription(`Activator of ${guild.name}: ${user}`)
                        ]
                    });
                }
                else {
                    return message.reply({
                        content: `<:icons_cross:1204719930046423050> Couldn't Get the Activator!`
                    });
                }
            }
        };
    }
}
//# sourceMappingURL=Premium.js.map