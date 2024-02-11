import OrasCommand from "../../abstract/OrasCommand.js";
import { getCount, getPremServerList, getUserPremtier, } from "../../wrapper/db/premium.js";
import Badges from "./Badges.js";
import axios from "axios";
const badge = new Badges();
export default class Profile extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "profile";
        this.aliases = ["pr", "badges", "badge"];
        this.cat = "utility";
        this.vc = false;
        this.samevc = false;
        this.desc = "Shows the profile for a user";
        this.usage = "profile [user]";
        this.premium = {
            guild: false,
            user: false,
        };
        this.dev = false;
        this.dispatcher = false;
        this.playing = false;
        this.exec = async (message, args, prefix) => {
            let user;
            let badges = "";
            if (message.mentions.users
                .filter((x) => x !== this.client.user)
                .first())
                user = message.mentions.users
                    .filter((x) => x !== this.client.user)
                    .first();
            else if (args[0])
                user = await this.client.users.fetch(args[0]);
            else if (!args[0])
                user = message.author;
            if (!user)
                return message.reply({
                    embeds: [
                        this.client.utils
                            .errorEmbed()
                            .setDescription(`${this.client.emoji.cross} Please provide me a valid user`),
                    ],
                });
            let check = this.client.utils.checkUserPrem(user.id);
            let guild = await this.client.guilds.fetch(this.client.config.supportId);
            if (!guild)
                return;
            let mem = await axios({
                url: `https://discord.com/api/v10/guilds/${guild.id}/members/${user.id}`,
                method: `GET`,
                headers: {
                    Authorization: `Bot ${this.client.config.token}`
                }
            }).catch((e) => {
                let premiumInfo;
                let check = this.client.utils.checkUserPrem(user.id);
                if (check === false)
                    premiumInfo = "Not A Premium User";
                else {
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
                    premiumInfo = `Premium Tier: \`${Tier}\`\nUsing Premium In: \`${upgrades}\` Servers\nUpgrades Left: \`${upgradesLeft}\`\nExpires On: <t:${this.client.utils.checkPremTime(user.id)}:R>`;
                }
                let em = this.client.utils
                    .premiumEmbed(message.guildId)
                    .setDescription(`__**User Achievements**__\n[\`No Badges Available\`](${this.client.config.voteUrl})\nKindly Join Our **[Support Server](${this.client.config.server})** to get some **[Badges](${this.client.config.server})** on your Profile!\n\n__**Premium Info**__\n${premiumInfo}`)
                    .addFields([
                        {
                            name: `__**User Achievements**__`,
                            value: `[\`No Badges Available\`](${this.client.config.voteUrl})\nKindly Join Our **[Support Server](${this.client.config.server})** to get some **[Badges](${this.client.config.server})** on your Profile!\``,
                            inline: true
                        },
                    ])
                    .addFields([
                        {
                            name: `__**Premium Info**__`,
                            value: `${premiumInfo}`,
                            inline: true
                        },
                    ])
                    .setAuthor({
                    name: `${this.client.user.username}`,
                    iconURL: this.client.user.displayAvatarURL(),
                })
                    .setTitle(`${user.username}'s Profile`)
                    .setURL(`${this.client.config.voteUrl}`)
                    .setFooter({
                    text: `Requested By: ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }));
                let b1 = this.client.utils.button(`link`, `Support`, null, null, this.client.config.server);
                let b2 = this.client.utils.button(`link`, `Premium`, null, null, this.client.config.server);
                let row = this.client.utils.actionRow([b1, b2]);
                return message.reply({
                    embeds: [em],
                    components: [row],
                });
            });
            if (!mem)
                badges = "";
            mem = mem.data;
            let sikku = mem?.roles;
            if (user.id === "1173547185758015498")
                badges += `\n<:owner:1166375413778493501> **[Sikku](https://discord.com/users/1173547185758015498)**`;
            if (user.id === "1173547185758015498")
                badges += `\n<:owner:1166375413778493501> **[Seek](https://discord.com/users/1173547185758015498)**`;
            if (user.id === "1173547185758015498")
                badges += `\n<:owner:1166375413778493501> **[Sumit](https://discord.com/users/1173547185758015498)**`;
            if (user.id === "1173547185758015498")
                badges += `\n<:owner:1166375413778493501> **[Rohit](https://discord.com/users/1173547185758015498)**`;
            if (sikku?.includes(badge.developer))
                badges += `\n<a:developer:1205388965083881475> **Developer**`;
            if (sikku?.includes(badge.owner))
                badges += `\n<a:Owner:1205389115424510023> **Owner**`;
            if (sikku?.includes(badge.codev))
                badges += `\n<a:DevBadge:1205391832922591272> **Co-Developer**`;
            if (sikku?.includes(badge.admin))
                badges += `\n<a:admin:1205393231370649680> **Admin**`;
            if (check === true)
                badges += `\n<a:premiumsub:1205393415534157834> **Premium User**`;
            if (sikku?.includes(badge.vip))
                badges += `\n<a:vip:1205394142813888604> **Vip**`;
            if (sikku?.includes(badge.communityManager))
                badges += `\n<a:manager:1205394449476354048> **Comunity Manager**`;
            if (sikku?.includes(badge.friend))
                badges += `\n<a:z_Friends:1205394761863659561> **Friend**`;
            if (sikku?.includes(badge.supporter))
                badges += `\n<a:supporter:1205394910816116746> **Supporter**`;
            if (sikku?.includes(badge.staff))
                badges += `\n<a:staff:1205395073697718342> **Support Team**`;
            if (sikku?.includes(badge.mod))
                badges += `\n<a:mod:1205415212140986370> **Moderator**`;
            if (sikku?.includes(badge.user))
                badges += `\n<a:users:1205415490567020585> **${this.client.user.username} User**`;
            else
                badges = "";
            if (badges === "")
                badges = `[\`No Badges Available\`](${this.client.config.voteUrl})\nKindly Join Our **[Support Server](${this.client.config.server})** to get some **[Badges](${this.client.config.server})** on your Profile!`;
            let premiumInfo;
            if (check === false)
                premiumInfo = "Not A Premium User";
            if (check === true) {
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
                    Tier = "<:icons_cross:1204719930046423050> Info Not Available <:info_icon:1205379953659617392>";
                premiumInfo = `Premium Tier: \`${Tier}\`\nUsing Premium In: \`${upgrades}\` Servers\nUpgrades Left: \`${upgradesLeft}\`\nExpires On: <t:${this.client.utils.checkPremTime(user.id)}:R>`;
            }
            let em = this.client.utils
                .premiumEmbed(message.guildId)
                .setAuthor({
                name: `${this.client.user.username}`,
                iconURL: this.client.user.displayAvatarURL(),
            })
                .setTitle(`${user.username}'s Profile`)
                .setURL(`https://discord.com/users/${user.id}`)
                .addFields([
                    {
                        name: `__**User Achievements**__`,
                        value: `${badges}`,
                        inline: true
                    },
                ])
                .addFields([
                    {
                        name: `__**Premium Info**__`,
                        value: `${premiumInfo}`,
                        inline: true
                    },
                ])
                .setThumbnail(user.displayAvatarURL({ dynamic: true }));
            let b1 = this.client.utils.button(`link`, `Premium`, null, null, `${this.client.config.server}`);
            let b2 = this.client.utils.button(`link`, `Support`, null, null, `${this.client.config.server}`);
            let row = this.client.utils.actionRow([b1, b2]);
            return message.reply({
                embeds: [em],
                components: [row],
            });
        };
    }
}
//# sourceMappingURL=Profile.js.map