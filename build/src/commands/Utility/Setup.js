  import { ActionRowBuilder, ButtonBuilder, messageLink, } from "discord.js";
import { addHex, getHex } from "../../wrapper/db/embeds.js";
import OrasCommand from "../../abstract/OrasCommand.js";
export default class Setup extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "setup";
        this.aliases = ["set"];
        this.cat = "utility";
        this.dev = false;
        this.manage = false;
        this.desc = "Configures Setup for the bot with dj/djrole/playtype etc";
        this.usage = "setup <player/playtype/music-system>";
        this.vote = false;
        this.premium = {
            guild: true,
            user: false,
        };
        this.vc = false;
        this.samevc = false;
        this.exec = async (message, args, prefix) => {
            if (!message.member.permissions.has("ManageGuild") &&
                !this.client.config.owners.includes(message.author.id) &&
                this.client.utils.checkActivator(message.guildId) !== message.author.id)
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`<:icons_cross:1204719930046423050> You need **Manage Guild** permissions to use this command`)
                            .setTitle(`Requires Permissions`),
                    ],
                });
            if (!args[0] ||
                ![
                    "embed",
                    "player",
                    "dj",
                    "music-system",
                    "djrole",
                    "dj-role",
                    "playtype",
                    "play-type",
                ].includes(args[0].toLowerCase()))
                return message.reply({
                    embeds: [
                        this.client.utils
                            .premiumEmbed(message.guildId)
                            .setTitle(`<:Setup:1205416051878395914> Setup Subcommands`)
                            .setAuthor({
                            name: `${this.client.user.username}`,
                            iconURL: this.client.user.displayAvatarURL(),
                        })
                            .setTimestamp()
                            .setDescription(`<:white_arrow:1204737655716315178>\`${prefix}setup embed\`\nSetups embed color for bot responses\n\n<:white_arrow:1204737655716315178>\`${prefix}setup player\`\nSetups player mode for the player\n\n<:white_arrow:1204737655716315178>\`${prefix}setup <dj/music-system>\`\nSetups a music system for a guild\n\n<:white_arrow:1204737655716315178>\`${prefix}setup dj-role\`\nSetups a djrole for a server\n\n<:white_arrow:1204737655716315178>  \`${prefix}setup play-type\`\nSetups play command for the server`),
                    ],
                });
            if (args[0].toLowerCase() === `embed`) {
                let get = getHex(message.guildId);
                let hex = args[1];
                if (!hex)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setDescription(`<:icons_cross:1204719930046423050> Please provide me a hex color`),
                        ],
                    });
                hex = checkHex(args[1]);
                if (hex === false)
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setDescription(`<:icons_cross:1204719930046423050> Please provide me a valid hex color code!`),
                        ],
                    });
                if (get.HEXCODE === null) {
                    addHex(message.guildId, `${args[1]}`);
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Updated** Embeds Color to \`${args[1]}\``),
                        ],
                    });
                }
                else {
                    let b1 = new ButtonBuilder()
                        .setStyle(3)
                        .setLabel(`Confirm`)
                        .setCustomId(`yes`)
                        .setEmoji('<:Check_Icon:1204720507623178290>');
                    let b2 = new ButtonBuilder()
                        .setStyle(4)
                        .setCustomId(`no`)
                        .setLabel(`Decline`)
                        .setEmoji('<:icons_cross:1204719930046423050>');
                    let row = new ActionRowBuilder().addComponents(b1, b2);
                    let msg = await message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setTitle(`Choose Your Options`)
                                .setDescription(`You already have set your custom embed color to: \`${get.HEXCODE}\`. Do you still wanna change ?`),
                        ],
                        components: [row],
                    });
                    let collector = await msg.createMessageComponentCollector({
                        filter: (i) => {
                            if (i.user.id === message.author.id)
                                return true;
                            else
                                return i.reply({
                                    content: `<:icons_cross:1204719930046423050> Sorry you are not welcomed using this interaction!`,
                                    ephemeral: true,
                                });
                        },
                        time: 100000 * 2,
                    });
                    collector.on("collect", async (interaction) => {
                        if (interaction.customId === `yes`) {
                            addHex(message.guildId, `${args[1]}`);
                            return interaction.update({
                                embeds: [
                                    this.client.utils
                                        .premiumEmbed()
                                        .setDescription(`<:Check_Icon:1204720507623178290> Successfully Set the custom embed color to: \`${args[1]}\`.`),
                                ],
                                components: [],
                            });
                        }
                        else if (interaction.customId === `no`) {
                            return interaction.update({
                                embeds: [
                                    this.client.utils
                                        .premiumEmbed()
                                        .setDescription(`<:icons_cross:1204719930046423050> Cancelled the Interaction`),
                                ],
                                components: [],
                            });
                        }
                    });
                    collector.on("end", async () => {
                        if (!collector.collected)
                            return;
                        else if (!msg)
                            return;
                        else
                            return await msg.edit({
                                embeds: [
                                    this.client.utils
                                        .premiumEmbed()
                                        .setDescription(`**You took too long to respond!**`),
                                ],
                                components: [],
                            });
                    });
                }
            }
            if (args[0].toLowerCase() === `player`) {
                let mode = this.client.utils.getPlayerMode(message.guild.id);
                if (mode === null)
                    mode = "Default";
                const em = this.client.utils
                    .premiumEmbed(message.guildId)
                    .setTitle(`<a:player:1205417437244432415> Player Mode Setup`)
                    .setAuthor({
                    name: `${this.client.user.username}`,
                    iconURL: this.client.user.displayAvatarURL(),
                })
                    .setDescription(`**${this.client.user.username} Premium Supports Different Player Modes. You can choose any of the listed Below**\n\n<:white_arrow:1204737655716315178>**TEC Classic Style**\n<:white_arrow:1204737655716315178>**TEC x Spotify Mode**\n<:white_arrow:1204737655716315178>**TEC Simple Mode**\n<:white_arrow:1204737655716315178>**TEC Special Mode**\n<:white_arrow:1204737655716315178>**TEC No Button Mode**\n<:white_arrow:1204737655716315178>**TEC Old School Style**`)
                    .setThumbnail(this.client.user.displayAvatarURL())
                    .setTimestamp()
                    .addFields([
                    {
                        name: `Current Player Mode`,
                        value: `${mode}`,
                    },
                ]);
                let b1 = this.client.utils.button(`custom_id`, `TEC Classic`, 2, `oras_classic_mode`);
                let b2 = this.client.utils.button(`custom_id`, `TEC x Spotify`, 3, `oras_spotify_mode`);
                let b3 = this.client.utils.button(`custom_id`, `TEC Simple`, 2, `oras_simple_mode`);
                let b4 = this.client.utils.button(`custom_id`, `TEC Special`, 1, `oras_special_mode`);
                let b5 = this.client.utils.button(`custom_id`, `No Buttons Style`, 2, `oras_no_mode`);
                let b6 = this.client.utils.button(`custom_id`, `TEC Old School`, 2, `oras_old_mode`);
                let buttons = [b1, b3, b2, b4];
                let buttons2 = [b5, b6];
                let row = this.client.utils.actionRow(buttons);
                let row2 = this.client.utils.actionRow(buttons2);
                return message.reply({
                    embeds: [em],
                    allowedMentions: { repliedUser: false },
                    components: [row, row2],
                });
            }
            if (args[0].toLowerCase() === `dj` ||
                args[0].toLowerCase() === `music-system`) {
                if (!args[1] ||
                    !["create", "delete", "fix", "config"].includes(args[1].toLowerCase())) {
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setTitle(`\`${prefix}setup dj\``)
                                .setDescription(`<:white_arrow:1204737655716315178>\`${prefix}setup dj create\`
                Creates a music system in the server
                
                <:white_arrow:1204737655716315178> \`${prefix}setup dj delete\`
                Deletes a music setup from the server
                
                <:white_arrow:1204737655716315178> \`${prefix}setup dj config\`
                Tells about the config of the music setup
                
                <:white_arrow:1204737655716315178> \`${prefix}setup dj fix\`
                Fixes the music setup of the server`),
                        ],
                    });
                }
                if (args[1].toLowerCase() === `create`) {
                    if (this.client.utils.checkDjSetup(message.guildId) === true) {
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guildId)
                                    .setDescription(`<:icons_cross:1204719930046423050> Setup Already exists at <#${this.client.utils.djSetupChannel(message.guildId)}>`),
                            ],
                        });
                    }
                    let channel = message.mentions.channels.first() ||
                        message.guild.channels.cache.get(args[2]);
                    if (!channel)
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guildId)
                                    .setDescription(`<:icons_cross:1204719930046423050> Please provide me a valid channel to be created setup on!`),
                            ],
                        });
                    if (!message.guild.members.me.permissionsIn(channel).has("ViewChannel"))
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .errorEmbed()
                                    .setDescription(`<:icons_cross:1204719930046423050> I don't have **View Channel** permissions in that channel!`)
                                    .setTitle(`Missing Permissions`),
                            ],
                        });
                    if (!message.guild.members.me.permissionsIn(channel).has("SendMessages"))
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .errorEmbed()
                                    .setDescription(`<:icons_cross:1204719930046423050> I don't have **Send Messages** permissions in that channel!`)
                                    .setTitle(`Missing Permissions`),
                            ],
                        });
                    if (!message.guild.members.me
                        .permissionsIn(channel)
                        .has("ReadMessageHistory"))
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .errorEmbed()
                                    .setDescription(`<:icons_cross:1204719930046423050> I don't have **Read Message History** permissions in that channel!`)
                                    .setTitle(`Missing Permissions`),
                            ],
                        });
                    if (!message.guild.members.me
                        .permissionsIn(channel)
                        .has("UseExternalEmojis"))
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .errorEmbed()
                                    .setDescription(`<:icons_cross:1204719930046423050> I don't have **Use External Emojis** permissions in that channel!`)
                                    .setTitle(`Missing Permissions`),
                            ],
                        });
                    if (!message.guild.members.me.permissionsIn(channel).has("EmbedLinks"))
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .errorEmbed()
                                    .setDescription(`<:icons_cross:1204719930046423050> I don't have **Embed Links** permissions in that channel!`)
                                    .setTitle(`Missing Permissions`),
                            ],
                        });
                    if (!message.guild.members.me
                        .permissionsIn(channel)
                        .has("ManageChannels"))
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .errorEmbed()
                                    .setDescription(`<:icons_cross:1204719930046423050> I don't have **Manage Channels** permissions in that channel!`)
                                    .setTitle(`Missing Permissions`),
                            ],
                        });
                    if (!message.guild.members.me
                        .permissionsIn(channel)
                        .has("ManageMessages"))
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .errorEmbed()
                                    .setDescription(`<:icons_cross:1204719930046423050> I don't have **Manage Messages** permissions in that channel!`)
                                    .setTitle(`Missing Permissions`),
                            ],
                        });
                    channel.send(`https://cdn.discordapp.com/attachments/1162795987014787162/1205424655679234088/gg.png?ex=65d85231&is=65c5dd31&hm=9746958b5c53418205d11bc9170b0c32b911e484bef10e2b3e26d530b37efd84&`);
                    let content = `__**Queue List**__\n\nJoin a Voice Channel and type in your Search Query or a Url`;
                    let em = this.client.utils
                        .embed()
                        .setTitle(`Nothing Playing Right Now`)
                        .setURL(`${this.client.config.voteUrl}`)
                        .setImage(`${this.client.config.setupBgLink}`)
                        .setAuthor({
                        name: `| Now Playing`,
                        iconURL: message.guild.iconURL({ dynamic: true }),
                    })
                        .setFooter({
                        text: `| Thanks for choosing ${this.client.user.username}`,
                        iconURL: this.client.user.displayAvatarURL(),
                    });
                    let b1 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_previous`, null, '<:icon_previous:1205421036829409352>');
                    let b2 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_stop`, null, '<:icons_stop_button:1205426251129430067>');
                    let b3 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_pause`, null, '<:icons_pause:1205426434584215596>');
                    let b4 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_loop`, null, '<:icons_loop:1205125247070900314>');
                    let b5 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_skip`, null, '<:icon_skip:1205426846234054686>');
                    let b6 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_volLow`, null, '<:LowVolume:1205427066896523285>');
                    let b7 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_fav`, null, '<:favorite:1205427215014043738>');
                    let b8 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_shuffle`, null, '<:icons_shuffle:1205427370299760680>');
                    let b9 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_autoplay`, null, '<:autoplay:1205137790623420418>');
                    let b10 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_volHigh`, null, '<:HighVolume:1205427649262919730>');
                    let row = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
                    let row2 = this.client.utils.actionRow([b6, b7, b8, b9, b10]);
                    let opt1 = this.client.utils.menuOption(`Reset Filters`, null, `Resets all the filters of the player`, `oras_dj_filter_reset`);
                    let opt2 = this.client.utils.menuOption(`8D`, null, `Sets Up 8d filter to the player`, `oras_dj_filter_8d`);
                    let opt3 = this.client.utils.menuOption(`BassBoost`, null, `Sets bassboost filter to the player`, `oras_dj_filter_bassboost`);
                    let opt4 = this.client.utils.menuOption(`NightCore`, null, `Sets NightCore filter to the player`, `oras_dj_filter_nightcore`);
                    let opt5 = this.client.utils.menuOption(`Vaporwave`, null, `Sets Vaporwave filter to the player`, `oras_dj_filter_vibrato`);
                    let options = [opt1, opt2, opt3, opt4, opt5];
                    let menu = this.client.utils.menu(`Choose filters`, `help-op`, options);
                    let ro = this.client.utils.actionRow([menu]);
                    let msg = await channel.send({
                        embeds: [em],
                        content: content,
                        components: [ro, row, row2],
                    });
                    this.client.utils.createDj(message.guildId, channel.id, msg.id);
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setTitle(`Setup Created`)
                                .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Created** Music Setup at ${channel}. Hope you enjoy me there`),
                        ],
                    });
                }
                if (args[1].toLowerCase() === `delete`) {
                    if (this.client.utils.checkDjSetup(message.guildId) === false)
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .errorEmbed()
                                    .setDescription(`<:icons_cross:1204719930046423050> There is no setup for this guild right now!`),
                            ],
                        });
                    let setup = this.client.utils.getDj(message.guildId);
                    let ch = message.guild.channels.cache.get(setup.CHANNEL);
                    if (ch) {
                        let msg = await ch.messages.fetch(setup.MESSAGE);
                        if (msg)
                            msg.delete().catch((e) => { });
                    }
                    this.client.utils.deleteDj(message.guildId);
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guild.id)
                                .setTimestamp()
                                .setTitle(`Deleted`)
                                .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Deleted** Server Music Setup`),
                        ],
                    });
                }
                if (args[1].toLowerCase() === `fix`) {
                    let setup = this.client.utils.getDj(message.guildId);
                    let ch = message.guild.channels.cache.get(setup.CHANNEL);
                    if (ch) {
                        let msg = await ch.messages.fetch(setup.MESSAGE);
                        if (!msg) {
                            ch.send(`https://cdn.discordapp.com/attachments/1162795987014787162/1205424655679234088/gg.png?ex=65d85231&is=65c5dd31&hm=9746958b5c53418205d11bc9170b0c32b911e484bef10e2b3e26d530b37efd84&`);
                            let content = `__**Queue List**__\n\nJoin a Voice Channel and type in your Search Query or a Url`;
                            let em = this.client.utils
                                .embed()
                                .setTitle(`Nothing Playing Right Now`)
                                .setURL(`${this.client.config.voteUrl}`)
                                .setImage(`${this.client.config.setupBgLink}`)
                                .setAuthor({
                                name: `| Now Playing`,
                                iconURL: message.guild.iconURL({ dynamic: true }),
                            })
                                .setFooter({
                                text: `| 💘 Thanks for choosing ${this.client.user.username}`,
                                iconURL: this.client.user.displayAvatarURL(),
                            });
                            let b1 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_previous`, null, '<:icon_previous:1205421036829409352>');
                            let b2 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_stop`, null, '<:icons_stop_button:1205426251129430067>');
                            let b3 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_pause`, null, '<:icons_pause:1205426434584215596>');
                            let b4 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_loop`, null, '<:icons_loop:1205125247070900314>');
                            let b5 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_skip`, null, '<:icon_skip:1205426846234054686>');
                            let b6 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_volLow`, null, '<:LowVolume:1205427066896523285>');
                            let b7 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_fav`, null, '<:favorite:1205427215014043738>');
                            let b8 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_shuffle`, null, '<:icons_shuffle:1205427370299760680>');
                            let b9 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_autoplay`, null, '<:autoplay:1205137790623420418>');
                            let b10 = this.client.utils.button(`custom_id`, null, 2, `oras_dj_volHigh`, null, '<:HighVolume:1205427649262919730>');
                            let row = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
                            let row2 = this.client.utils.actionRow([b6, b7, b8, b9, b10]);
                            let opt1 = this.client.utils.menuOption(`Reset Filters`, null, `Resets all the filters of the player`, `oras_dj_filter_reset`);
                            let opt2 = this.client.utils.menuOption(`8D`, null, `Sets Up 8d filter to the player`, `oras_dj_filter_8d`);
                            let opt3 = this.client.utils.menuOption(`BassBoost`, null, `Sets bassboost filter to the player`, `oras_dj_filter_bassboost`);
                            let opt4 = this.client.utils.menuOption(`NightCore`, null, `Sets NightCore filter to the player`, `oras_dj_filter_nightcore`);
                            let opt5 = this.client.utils.menuOption(`Vaporwave`, null, `Sets Vaporwave filter to the player`, `oras_dj_filter_vibrato`);
                            let options = [opt1, opt2, opt3, opt4, opt5];
                            let menu = this.client.utils.menu(`Choose filters`, `help-op`, options);
                            let ro = this.client.utils.actionRow([menu]);
                            let msg = await ch.send({
                                embeds: [em],
                                content: content,
                                components: [ro, row, row2],
                            });
                            this.client.utils.createDj(message.guildId, ch.id, msg.id);
                            return message.reply({
                                embeds: [
                                    this.client.utils
                                        .premiumEmbed(message.guildId)
                                        .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Fixed** the Music Setup`)
                                        .setTitle(`Setup Fixed`)
                                        .setTimestamp(),
                                ],
                            });
                        }
                        else
                            return message.reply({
                                embeds: [
                                    this.client.utils
                                        .errorEmbed()
                                        .setDescription(`<:icons_cross:1204719930046423050> Setup seems to be fine`),
                                ],
                            });
                    }
                    else {
                        this.client.utils.deleteDj(message.guildId);
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guildId)
                                    .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Fixed** the Music Setup. Create a new one using \`setup dj create\``)
                                    .setTitle(`Setup Fixed`)
                                    .setTimestamp(),
                            ],
                        });
                    }
                }
                if (args[1].toLowerCase() === `config`) {
                    if (this.client.utils.checkDjSetup(message.guildId) === false)
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .errorEmbed()
                                    .setDescription(`<:icons_cross:1204719930046423050> There is no setup for this guild yet!`),
                            ],
                        });
                    let setup = this.client.utils.getDj(message.guild.id);
                    let ch = message.guild.channels.get(setup.CHANNEL);
                    let msg = await ch.message.fetch(setup.MESSAGE);
                    let em = this.client.utils
                        .premiumEmbed(message.guildId)
                        .setTitle(`Setup Config`)
                        .setDescription(`You set has been setupped here: ${ch}\nMessage Link:${messageLink(ch.id, msg.id)}`)
                        .setTimestamp()
                        .setFooter({
                        text: `Requested By: ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true }),
                    });
                    return message.reply({
                        embeds: [em],
                    });
                }
            }
            if (args[0].toLowerCase() === `djrole`) {
                if (!args[1] || !["set", "reset"].includes(args[1].toLowerCase()))
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guildId)
                                .setTitle(`Djrole Subcommands`)
                                .setDescription(`<:white_arrow:1204737655716315178>\`${prefix}setup djrole set\`\nSets a djrole for the server\n\n<:white_arrow:1204737655716315178>\`${prefix}setup djrole reset\`\nResets the djrole for the server`)
                                .setTimestamp(),
                        ],
                    });
                if (args[1].toLowerCase() === `set`) {
                    let role = message.mentions.roles.first() ||
                        message.guild.roles.cache.get(args[2]);
                    if (!role)
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .errorEmbed()
                                    .setDescription(`<:icons_cross:1204719930046423050> Please provide me a valid role`),
                            ],
                        });
                    let get = this.client.utils.getdjrole(message.guildId);
                    let pn = message.guild.roles.cache.get(get);
                    if (get === null || !pn) {
                        this.client.utils.addDjRole(message.guild.id, role.id);
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guild.id)
                                    .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Updated** Djrole to ${role}`)
                                    .setTitle(`Djrole Updated`),
                            ],
                        });
                    }
                    else {
                        let em = this.client.utils
                            .premiumEmbed(message.guildId)
                            .setDescription(`Your dj role is already set to: ${pn}. Do you really want to change it?`)
                            .setTitle(`Choose Below`)
                            .setTimestamp();
                        let b1 = this.client.utils.button(`custom_id`, `Confirm`, 3, `yeah`, null, '<:Check_Icon:1204720507623178290>');
                        let b2 = this.client.utils.button(`custom_id`, `Decline`, 4, `nope`, null, '<:icons_cross:1204719930046423050>');
                        let buttons = [b1, b2];
                        let row = this.client.utils.actionRow(buttons);
                        let msg = await message.reply({
                            embeds: [em],
                            components: [row],
                        });
                        let collector = await msg.createMessageComponentCollector({
                            filter: (b) => {
                                if (b.user.id === message.author.id)
                                    return true;
                                else
                                    return b.reply({
                                        content: `<:icons_cross:1204719930046423050> You are not the command requester`,
                                        ephemeral: true,
                                    });
                            },
                            time: 100000 * 7,
                        });
                        collector.on("collect", async (interaction) => {
                            if (interaction.isButton()) {
                                if (interaction.customId === `yeah`) {
                                    this.client.utils.addDjRole(message.guildId, role.id);
                                    return interaction.update({
                                        embeds: [
                                            this.client.utils
                                                .premiumEmbed(message.guildId)
                                                .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Updated** Djrole to ${role}`)
                                                .setTitle(`Djrole Updated`),
                                        ],
                                        components: [],
                                    });
                                }
                                else if (interaction.customId === `nope`) {
                                    return interaction.update({
                                        embeds: [
                                            this.client.utils
                                                .premiumEmbed(message.guild.id)
                                                .setDescription(`**Cancelled The Action**`),
                                        ],
                                        components: [],
                                    });
                                }
                            }
                        });
                        collector.on("end", async () => {
                            if (collector.collected)
                                return;
                            else if (!msg)
                                return;
                            else
                                return await msg.edit({
                                    embeds: [
                                        this.client.utils
                                            .premiumEmbed(message.guildId)
                                            .setTitle(`You took to long to resond`),
                                    ],
                                    components: [],
                                });
                        });
                    }
                }
                if (args[1].toLowerCase() === `reset`) {
                    let get = this.client.utils.getdjrole(message.guildId);
                    if (get === null)
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guildId)
                                    .setDescription(`<:icons_cross:1204719930046423050> There is no djrole setupped for this guild`),
                            ],
                        });
                    else {
                        this.client.utils.deleteDjRole(message.guild.id);
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guild.id)
                                    .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Deleted** Dj role for the server`),
                            ],
                        });
                    }
                }
            }
            if (args[0].toLowerCase() === `playtype` ||
                args[0].toLowerCase() === `play-type`) {
                let type = this.client.utils.getPlay(message.guildId);
                if (type === `buttons` || type === null)
                    type = "Buttons";
                else if (type === `direct`)
                    type = "Direct";
                let em = this.client.utils
                    .premiumEmbed(message.guildId)
                    .setTitle(`Choose the Play Type Below`)
                    .setDescription(`**Currently the play type is set to: \`${type}\`.Choose the options below to change it!**`)
                    .addFields([
                    {
                        name: `Buttons`,
                        inline: true,
                        value: `Play commands get configured with the buttons`,
                    },
                    {
                        name: `Direct`,
                        inline: true,
                        value: `Play commands gets started with direct queries`,
                    },
                ])
                    .setTimestamp();
                let b1 = this.client.utils.button(`custom_id`, `Buttons`, 3, `buttons_type`);
                let b2 = this.client.utils.button(`custom_id`, `Direct`, 4, `direct_type`);
                let row = this.client.utils.actionRow([b1, b2]);
                let msg = await message.reply({
                    embeds: [em],
                    components: [row],
                });
                let collector = await msg.createMessageComponentCollector({
                    filter: (b) => {
                        if (b.user.id === message.author.id)
                            return true;
                        else
                            return b.reply({
                                content: `<:icons_cross:1204719930046423050> You are not the command requester`,
                                ephemeral: true,
                            });
                    },
                    time: 100000 * 7,
                });
                collector.on("collect", async (interaction) => {
                    if (interaction.isButton()) {
                        if (interaction.customId === `buttons_type`) {
                            this.client.utils.updatePlay(message.guildId, "buttons");
                            return interaction.update({
                                embeds: [
                                    this.client.utils
                                        .premiumEmbed(message.guildId)
                                        .setTitle(`Updated Play Style`)
                                        .setDescription(`<:Check_Icon:1204720507623178290> Successfully **Updated** Play style to: \`Buttons\``),
                                ],
                                components: [],
                            });
                        }
                        else if (interaction.customId === `direct_type`) {
                            this.client.utils.updatePlay(message.guildId, "direct");
                            return interaction.update({
                                embeds: [
                                    this.client.utils
                                        .premiumEmbed(message.guildId)
                                        .setTitle(`Updated Play Style`)
                                        .setDescription(`<:Check_Icon:1204720507623178290> Play style has been **Updated** to: \`Direct\``),
                                ],
                                components: [],
                            });
                        }
                    }
                });
                collector.on("end", async () => {
                    if (collector.collected)
                        return;
                    else if (!msg)
                        return;
                    else
                        return await msg.edit({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guild.id)
                                    .setDescription(`**You didn't respond in time!**`),
                            ],
                            components: [],
                        });
                });
            }
        };
    }
}
function checkHex(x) {
    if (x.length !== 7 && !x.startsWith("#"))
        return false;
    else
        return true;
}
//# sourceMappingURL=Setup.js.map