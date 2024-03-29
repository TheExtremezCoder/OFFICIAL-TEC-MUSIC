import { EmbedBuilder } from "discord.js";
import OrasCommand from "../../abstract/OrasCommand.js";
import "ms";
import ms from "ms";
import { addPrem } from "../../wrapper/db/premium.js";
const tiers = [
    "bronze-tier",
    "silver-tier",
    "gold-tier",
    "diamond-tier",
    "bronze_tier",
    "silver_tier",
    "gold_tier",
    "diamond_tier",
];
export default class AddPremium extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "addPremium";
        this.aliases = ["addpremium", "addprem", "+prem"];
        this.cat = "dev";
        this.manage = true;
        this.desc = "Adds Premium to a user";
        this.usage = "addPremium <user> <time> <server_count>";
        this.dev = false;
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
                            .setFooter({
                            text: `${message.author.tag}:- Requester`,
                            iconURL: message.author.displayAvatarURL({ dynamic: true }),
                        })
                            .setDescription(`### <:Icon_Premium:1204719583982911509> \`${prefix}addPremium <user> <time> <count>\` <:Icon_Premium:1204719583982911509>`),
                    ],
                });
            let user;
            if (message.mentions.users
                .filter((x) => x !== this.client.user)
                .first())
                user = message.mentions.users
                    .filter((x) => x !== this.client.user)
                    .first();
            else if (args[1])
                user = await this.client.users.fetch(args[0]);
            if (!user)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setDescription(`# <:icons_cross:1204719930046423050> Please provide me a valid User`),
                    ],
                });
            let count = 0;
            let tier = "unknown";
            let reason = ``;
            let time = Math.round((Date.now() + ms("1day")) / 1000);
            if (args[1] && args[1].toLowerCase() === `bronze-tier`) {
                tier = "bronze";
                time = Math.round((Date.now() + ms(`30 days`)) / 1000);
                count = 0;
                reason = `${message.author.tag} | ${args.slice(2).join(" ")
                    ? args.slice(2).join(" ")
                    : `No Reason Provided`}`;
            }
            else if (args[1] && args[1].toLowerCase() === `silver-tier`) {
                tier = "silver";
                time = Math.round((Date.now() + ms(`30 days`)) / 1000);
                count = 1;
                reason = `${message.author.tag} | ${args.slice(2).join(" ")
                    ? args.slice(2).join(" ")
                    : `No Reason Provided`}`;
            }
            else if (args[1] && args[1].toLowerCase() === `gold-tier`) {
                tier = "gold";
                time = Math.round((Date.now() + ms(`60 days`)) / 1000);
                count = 3;
                reason = `${message.author.tag} | ${args.slice(2).join(" ")
                    ? args.slice(2).join(" ")
                    : `No Reason Provided`}`;
            }
            else if (args[1] && args[1].toLowerCase() === `diamond-tier`) {
                tier = "diamond";
                time = Math.round((Date.now() + ms(`90 days`)) / 1000);
                count = 5;
                reason = `${message.author.tag} | ${args.slice(2).join(" ")
                    ? args.slice(2).join(" ")
                    : `No Reason Provided`}`;
            }
            else if (args[1] && !tiers.includes(args[1].toLowerCase() && args[2])) {
                time = Math.round((Date.now() + ms(`${args[1]}`)) / 1000);
                count = Number(args[2]);
                tier = "special";
                reason = `${message.author.tag} | ${args.slice(3).join(" ")
                    ? args.slice(3).join(" ")
                    : "No Reason Provided"}`;
            }
            else {
                reason = `${message.author.tag} | ${args.slice(3).join(" ")
                    ? args.slice(3).join(" ")
                    : "No Reason Provided"}`;
                count = 1;
                tier = "none";
                time = Math.round((Date.now() + ms(`1 day`)) / 1000);
            }
            if (!time)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setTimestamp()
                            .setAuthor({
                            name: `${this.client.user.username}`,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                            .setDescription(`<:icons_cross:1204719930046423050> Please provide me a valid time period!`),
                    ],
                });
            if (this.client.utils.checkUserPrem(user.id))
                return message.reply({
                    embeds: [
                        this.client.utils
                            .errorEmbed()
                            .setDescription(`** <:icons_cross:1204719930046423050> This User is already a Premium User!\n### Try updating premium by \`${prefix}updatePremium\` Command <:Icon_Premium:1204719583982911509>**`),
                    ],
                });
            let code = this.client.utils.genPremId();
            let add = addPrem(user.id, time, count, code, reason, tier);
            if (add === true)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setTimestamp()
                            .setTitle(`Premium Added`)
                            .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Added** Premium to ${user} for ${count} Servers\nwhich will expire on: <t:${time}> (<t:${time}:R>)\nExecutive Code: \`${code}\``),
                    ],
                });
            else
                return message.reply({
                    content: `<:icons_cross:1204719930046423050> Failed! Please contact my dev!`,
                });
        };
    }
  
}
//# sourceMappingURL=AddPremium.js.map