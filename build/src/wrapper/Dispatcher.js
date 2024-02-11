import { Collection } from "discord.js";
import { get247Set, getAutoplay } from "./db/settings.js";
export default class OrasDispatcher {
  client;
  guild;
  channel;
  player;
  repeat;
  current;
  stopped;
  sikku;
  previous;
  queue;
  // public filters: object;
  data;
  constructor(client, guild, channel, player) {
    this.client = client;
    this.guild = guild;
    this.channel = channel;
    this.player = player;
    this.repeat = "off";
    this.queue = [];
    this.data = new Collection();
    this.current = null;
    this.previous = null;
    this.stopped = false;
    this.sikku = false;
    // this.filters = {
    //   eightD: false,
    //   nightcore: false,
    //   bassboost: false,
    //   daycore: false,
    //   vaporwave: false,
    //   pop: false,
    //   soft: false,
    //   china: false,
    //   chipmunk: false,
    //   distortion: false,
    //   earrape: false,
    //   karaoke: false,
    //   treblebass: false,
    //   tremolo: false,
    //   vibrato: false,
    // };
    this.player.on("start", async () => {
      if (this.repeat === "one") {
        if (this.sikku) return;
        else this.sikku = true;
      }
      if (this.repeat === "all" || this.repeat === "off") {
        this.sikku = false;
      }
      if (this.client.utils.checkDjSetup(this.guild.id) === true) {
        let setup = this.client.utils.getDj(this.guild.id);
        let ch = await this.guild.channels.fetch(setup.CHANNEL);
        if (ch) {
          this.updateQueue(this.guild, this.queue);
          ch.messages.fetch(setup.MESSAGE).then((x) => {
            x.edit({
              embeds: [
                this.client.utils
                  .embed()
                  .setTitle(
                    `<:playing_now:1205134000944058450> ${this.current.info.title.substring(
                      0,
                      40,
                    )}`,
                  )
                  .setURL(`${this.client.config.voteUrl}`)
                  .addFields([
                    {
                      name: `<:icon_request:1205477179258044466> Requester`,
                      value: `${this.current.info.requester.tag}`,
                      inline: true,
                    },
                    {
                      name: `<:duration:1205478282145828938> Duration`,
                      value: `${this.client.utils.humanize(
                        this.current.info.length,
                      )}`,
                      inline: true,
                    },
                    {
                      name: `<:user:1204719348594253844> Song Author`,
                      value: `[${this.current.info.author}](${this.client.config.voteUrl})`,
                      inline: true,
                    },
                  ])
                  .setImage(`${this.client.config.setupBgLink}`)
                  .setFooter({
                    text: ` Thanks for choosing ${this.client.user.username}`,
                    iconURL: this.client.user.displayAvatarURL(),
                  })
                  .setAuthor({
                    name: `| Now Playing`,
                    iconURL: this.client.user.displayAvatarURL(),
                  }),
              ],
            });
          });
        }
      }
      let setting = this.client.utils.getPlayerMode(this.guild.id);
      if (setting === "oras-old") {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setDescription(
            `[${this.current.info.title}](${this.client.config.voteUrl}) By [${
              this.current.info.author
            }](${this.client.config.voteUrl})  [${this.client.utils.humanize(
              this.current.info.length,
            )}]`,
          )
          .setThumbnail(
            this.current.info.requester.displayAvatarURL({ dynamic: true }),
          )
          .setAuthor({
            name: `| Now Playing`,
            iconURL: this.current.info.requester.displayAvatarURL({
              dynamic: true,
            }),
          });
        let b1 = this.client.utils.button(`custom_id`, `Stop`, 4, `oras_stop`);
        let b2 = this.client.utils.button(
          `custom_id`,
          `Pause`,
          3,
          `oras_pause`,
        );
        let b3 = this.client.utils.button(`custom_id`, `Loop`, 1, `oras_loop`);
        let b4 = this.client.utils.button(
          `custom_id`,
          `Previous`,
          2,
          `oras_previous`,
        );
        let b5 = this.client.utils.button(`custom_id`, `Skip`, 2, `oras_skip`);
        let row = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row],
            })
            .then((x) => {
              this.data.set("Oras", x);
            });
        return;
      }
      if (setting === `oras-classic`) {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setThumbnail(
            `https://img.youtube.com/vi/${this.current.info.identifier}/maxresdefault.jpg`,
          )
          .setTitle(
            `<:playing_now:1205134000944058450> ${this.current.info.title.substring(
              0,
              30,
            )}`,
          )
          .setURL(`${this.client.config.voteUrl}`)
          .setDescription(
            `<:icon_request:1205477179258044466> **Requester :** ${
              this.current.info.requester.tag
            }\n<:duration:1205478282145828938> **Duration :** ${this.client.utils.humanize(
              this.current.info.length,
            )}`,
          );
        let b1 = this.client.utils.button(`custom_id`, `Stop`, 4, `oras_stop`);
        let b2 = this.client.utils.button(
          `custom_id`,
          `Pause`,
          3,
          `oras_pause`,
        );
        let b3 = this.client.utils.button(`custom_id`, `Loop`, 1, `oras_loop`);
        let b4 = this.client.utils.button(
          `custom_id`,
          `Previous`,
          2,
          `oras_previous`,
        );
        let b5 = this.client.utils.button(`custom_id`, `Skip`, 2, `oras_skip`);
        let row = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row],
            })
            .then((x) => this.data.set("Oras", x));
        return;
      }
      if (setting === "oras-no") {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setAuthor({
            name: `Now Playing`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setThumbnail(
            this.current.info.requester.displayAvatarURL({ dynamic: true }),
          )
          .setDescription(
            `<:Icon_Music:1205379321305370714> [${this.current.info.title.substring(
              0,
              35,
            )}](${this.client.config.voteUrl})`,
          )
          .addFields([
            {
              name: `<:icon_request:1205477179258044466> Requester`,
              value: `${this.current.info.requester.tag}`,
              inline: true,
            },
            {
              name: `<:duration:1205478282145828938> Duration`,
              value: `${this.client.utils.humanize(this.current.info.length)}`,
              inline: true,
            },
          ]);
        let opt1 = this.client.utils.menuOption(
          `Reset Filters`,
          "<:filters:1205379624587239425>",
          `Resets all the filters of the player`,
          `oras_filter_reset`,
        );
        let opt2 = this.client.utils.menuOption(
          `8D`,
          "<:filters:1205379624587239425>",
          `Sets Up 8d filter to the player`,
          `oras_filter_8d`,
        );
        let opt3 = this.client.utils.menuOption(
          `BassBoost`,
          "<:filters:1205379624587239425>",
          `Sets bassboost filter to the player`,
          `oras_filter_bassboost`,
        );
        let opt4 = this.client.utils.menuOption(
          `NightCore`,
          "<:filters:1205379624587239425>",
          `Sets NightCore filter to the player`,
          `oras_filter_nightcore`,
        );
        let opt5 = this.client.utils.menuOption(
          `Vaporwave`,
          "<:filters:1205379624587239425>",
          `Sets Vaporwave filter to the player`,
          `oras_filter_vibrato`,
        );
        let options = [opt1, opt2, opt3, opt4, opt5];
        let menu = this.client.utils.menu(
          `Choose filters`,
          `no-buttons`,
          options,
        );
        let row = this.client.utils.actionRow([menu]);
        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row],
            })
            .then((x) => this.data.set("Oras", x));
        return;
      }
      if (setting === `oras-special`) {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setTitle(`${this.current.info.title.substring(0, 35)}`)
          .setURL(`${this.client.config.voteUrl}`)
          .addFields([
            {
              name: `<:icon_request:1205477179258044466> Requester`,
              value: `${this.current.info.requester.tag}`,
              inline: true,
            },
            {
              name: `<:duration:1205478282145828938> Duration`,
              value: `${this.client.utils.humanize(this.current.info.length)}`,
            },
          ])
          .setThumbnail(
            `https://img.youtube.com/vi/${this.current.info.identifier}/maxresdefault.jpg`,
          );
        let b1 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_previous`,
          null,
          "<:icon_previous:1205421036829409352>",
        );
        let b2 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_shuffle`,
          null,
          "<:icons_shuffle:1205427370299760680>",
        );
        let b3 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_pause`,
          null,
          "<:icons_pause:1205426434584215596>",
        );
        let b4 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_loop`,
          null,
          "<:icons_loop:1205125247070900314>",
        );
        let b5 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_skip`,
          null,
          "<:icon_skip:1205426846234054686>",
        );
        let b6 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_volLow`,
          null,
          "<:LowVolume:1205427066896523285>",
        );
        let b7 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_backward`,
          null,
          "<:backward:1205453457612472364>",
        );
        let b8 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_stop`,
          null,
          "<:icons_stop_button:1205426251129430067>",
        );
        let b9 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_forward`,
          null,
          "<:forward:1205453288577961994>",
        );
        let b10 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_volHigh`,
          null,
          "<:HighVolume:1205427649262919730>",
        );
        let row1 = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
        let row2 = this.client.utils.actionRow([b6, b7, b8, b9, b10]);
        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row1, row2],
            })
            .then((x) => this.data.set("Oras", x));
        return;
      }
      if (setting === `oras-simple`) {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setAuthor({
            name: `Now Playing`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setDescription(
            `[${this.current.info.title.substring(0, 35)}](${
              this.client.config.voteUrl
            })`,
          )
          .addFields([
            {
              name: `<:icon_request:1205477179258044466> Requester`,
              value: `${this.current.info.requester.tag}`,
              inline: true,
            },
            {
              name: `<:duration:1205478282145828938> Duration`,
              value: `${this.client.utils.humanize(this.current.info.length)}`,
              inline: true,
            },
            {
              name: `<:user:1204719348594253844> Author`,
              value: `${this.current.info.author}`,
              inline: true,
            },
          ]);
        let opt1 = this.client.utils.menuOption(
          `Reset Filters`,
          "<:filters:1205379624587239425>",
          `Resets all the filters of the player`,
          `oras_filter_reset`,
        );
        let opt2 = this.client.utils.menuOption(
          `8D`,
          "<:filters:1205379624587239425>",
          `Sets Up 8d filter to the player`,
          `oras_filter_8d`,
        );
        let opt3 = this.client.utils.menuOption(
          `BassBoost`,
          "<:filters:1205379624587239425>",
          `Sets bassboost filter to the player`,
          `oras_filter_bassboost`,
        );
        let opt4 = this.client.utils.menuOption(
          `NightCore`,
          "<:filters:1205379624587239425>",
          `Sets NightCore filter to the player`,
          `oras_filter_nightcore`,
        );
        let opt5 = this.client.utils.menuOption(
          `Vaporwave`,
          "<:filters:1205379624587239425>",
          `Sets Vaporwave filter to the player`,
          `oras_filter_vibrato`,
        );
        let options = [opt1, opt2, opt3, opt4, opt5];
        let menu = this.client.utils.menu(`Choose filters`, `help-op`, options);
        let row1 = this.client.utils.actionRow([menu]);
        let b1 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_pause`,
          null,
          "<:icons_pause:1205426434584215596>",
        );
        let b2 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_skip`,
          null,
          "<:icon_skip:1205426846234054686>",
        );
        let b3 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_loop`,
          null,
          "<:icons_loop:1205125247070900314>",
        );
        let b4 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_stop`,
          null,
          "<:icons_stop_button:1205426251129430067>",
        );
        let row2 = this.client.utils.actionRow([b1, b2, b3, b4]);
        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row1, row2],
            })
            .then((x) => this.data.set("Oras", x));
        return;
      }
      if (setting === `oras-spotify`) {
        let opt1 = this.client.utils.menuOption(
          `Reset Filters`,
          "<:filters:1205379624587239425>",
          `Resets all the filters of the player`,
          `oras_filter_reset`,
        );
        let opt2 = this.client.utils.menuOption(
          `8D`,
          "<:filters:1205379624587239425>",
          `Sets Up 8d filter to the player`,
          `oras_filter_8d`,
        );
        let opt3 = this.client.utils.menuOption(
          `BassBoost`,
          "<:filters:1205379624587239425>",
          `Sets bassboost filter to the player`,
          `oras_filter_bassboost`,
        );
        let opt4 = this.client.utils.menuOption(
          `NightCore`,
          "<:filters:1205379624587239425>",
          `Sets NightCore filter to the player`,
          `oras_filter_nightcore`,
        );
        let opt5 = this.client.utils.menuOption(
          `Vaporwave`,
          "<:filters:1205379624587239425>",
          `Sets Vaporwave filter to the player`,
          `oras_filter_vibrato`,
        );
        let options = [opt1, opt2, opt3, opt4, opt5];
        let menu = this.client.utils.menu(`Choose filters`, `help-op`, options);
        let row1 = this.client.utils.actionRow([menu]);
        let b1 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_previous`,
          null,
          "<:icon_previous:1205421036829409352>",
        );
        let b2 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_shuffle`,
          null,
          "<:icons_shuffle:1205427370299760680>",
        );
        let b3 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_pause`,
          null,
          "<:icons_pause:1205426434584215596>",
        );
        let b4 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_loop`,
          null,
          "<:icons_loop:1205125247070900314>",
        );
        let b5 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_skip`,
          null,
          "<:icon_skip:1205426846234054686>",
        );
        let b6 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_volLow`,
          null,
          "<:LowVolume:1205427066896523285>",
        );
        let b7 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_backward`,
          null,
          "<:backward:1205453457612472364>",
        );
        let b8 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_stop`,
          null,
          "<:icons_stop_button:1205426251129430067>",
        );
        let b9 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_forward`,
          null,
          "<:forward:1205453288577961994>",
        );
        let b10 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_volHigh`,
          null,
          "<:HighVolume:1205427649262919730>",
        );
        let row2 = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
        let row3 = this.client.utils.actionRow([b6, b7, b8, b9, b10]);
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setAuthor({
            name: `Now Playing`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setDescription(
            `'<:playing_now:1205134000944058450>' [${this.current.info.title.substring(
              0,
              40,
            )}](${this.client.config.voteUrl})`,
          )
          .setThumbnail(
            `https://img.youtube.com/vi/${this.current.info.identifier}/maxresdefault.jpg`
              ? `https://img.youtube.com/vi/${this.current.info.identifier}/maxresdefault.jpg`
              : this.current.info.requester.displayAvatarURL({ dynamic: true }),
          )
          .addFields([
            {
              name: `<:icon_request:1205477179258044466> Requester`,
              value: `${this.current.info.requester.tag}`,
              inline: true,
            },
            {
              name: `<:duration:1205478282145828938> Duration`,
              value: `${this.client.utils.humanize(this.current.info.length)}`,
              inline: true,
            },
          ]);
        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            .send({
              embeds: [em],
              components: [row1, row2, row3],
            })
            .then((x) => this.data.set("Oras", x));
        return;
      }
      if (setting === `oras-new`) {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setDescription(
            `<:playing_now:1205134000944058450> [\`${this.current.info.title.substring(
              0,
              35,
            )}\`](${
              this.client.config.voteUrl
            })\n<:icon_request:1205477179258044466> **Requester :** ${
              this.current.info.requester.tag
            }\n<:duration:1205478282145828938> ${this.client.utils.humanize(
              this.current.info.length,
            )}`,
          )
          .setAuthor({
            name: `Now Playing`,
            iconURL: this.current.info.requester.displayAvatarURL({
              dynamic: true,
            }),
          });
        let b1 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `oras_pause`,
          null,
          "<:icons_pause:1205426434584215596>",
        );
        let b2 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_previous`,
          null,
          "<:icon_previous:1205421036829409352>",
        );
        let b3 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_stop`,
          null,
          "<:icons_stop_button:1205426251129430067>",
        );
        let b4 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_skip`,
          null,
          "<:icon_skip:1205426846234054686>",
        );
        let b5 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_fav`,
          null,
          "<:favorite:1205427215014043738>",
        );
        let row = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row],
            })
            .then((x) => this.data.set("Oras", x));
        return;
      } else {
        this.client.utils.updatePlayerMode(this.guild.id, "oras-simple");
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setAuthor({
            name: `<a:player:1205417437244432415> Now Playing`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setThumbnail(
            `https://img.youtube.com/vi/${this.current.info.identifier}/maxresdefault.jpg`,
          )
          .setDescription(
            `[${this.current.info.title.substring(0, 35)}](${
              this.client.config.voteUrl
            })`,
          )
          .addFields([
            {
              name: `<:icon_request:1205477179258044466> Requester`,
              value: `${this.current.info.requester.tag}`,
              inline: true,
            },
            {
              name: `<:duration:1205478282145828938> Duration`,
              value: `${this.client.utils.humanize(this.current.info.length)}`,
              inline: true,
            },
            {
              name: `<:user:1204719348594253844> Author`,
              value: `${this.current.info.author}`,
              inline: true,
            },
          ]);
        let opt1 = this.client.utils.menuOption(
          `Reset Filters`,
          "<:filters:1205379624587239425>",
          `Resets all the filters of the player`,
          `oras_filter_reset`,
        );
        let opt2 = this.client.utils.menuOption(
          `8D`,
          "<:filters:1205379624587239425>",
          `Sets Up 8d filter to the player`,
          `oras_filter_8d`,
        );
        let opt3 = this.client.utils.menuOption(
          `BassBoost`,
          "<:filters:1205379624587239425>",
          `Sets bassboost filter to the player`,
          `oras_filter_bassboost`,
        );
        let opt4 = this.client.utils.menuOption(
          `NightCore`,
          "<:filters:1205379624587239425>",
          `Sets NightCore filter to the player`,
          `oras_filter_nightcore`,
        );
        let opt5 = this.client.utils.menuOption(
          `Vaporwave`,
          "<:filters:1205379624587239425>",
          `Sets Vaporwave filter to the player`,
          `oras_filter_vibrato`,
        );
        let options = [opt1, opt2, opt3, opt4, opt5];
        let menu = this.client.utils.menu(`Choose filters`, `help-op`, options);
        let row1 = this.client.utils.actionRow([menu]);
        let b1 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_pause`,
          null,
          "<:icons_pause:1205426434584215596>",
        );
        let b2 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_skip`,
          null,
          "<:icon_skip:1205426846234054686>",
        );
        let b3 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_loop`,
          null,
          "<:icons_loop:1205125247070900314>",
        );
        let b4 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `oras_stop`,
          null,
          "<:icons_stop_button:1205426251129430067>",
        );
        let row2 = this.client.utils.actionRow([b1, b2, b3, b4]);
        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row1, row2],
            })
            .then((x) => this.data.set("Oras", x));
        return;
      }
    });
    this.player.on("end", async () => {
      if (this.client.utils.checkDjSetup(this.guild.id) === true) {
        this.updateQueue(this.guild, this.queue);
        let set = this.client.utils.getDj(this.guild.id);
        let ch = await this.guild.channels.fetch(set.CHANNEL);
        ch.messages.fetch(set.MESSAGE).then((msg) =>
          msg.edit({
            embeds: [
              this.client.utils
                .embed()
                .setTitle(`Nothing Playing Right Now`)
                .setURL(`${this.client.config.voteUrl}`)
                .setImage(`${this.client.config.setupBgLink}`)
                .setAuthor({
                  name: `| Now Playing`,
                  iconURL: this.guild.iconURL({ dynamic: true }),
                })
                .setFooter({
                  text: ` Thanks for choosing ${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                }),
            ],
          }),
        );
      }
      try {
        this.data.get("Oras")?.delete();
      } catch (e) {
        /** */
      }
      this.data.delete("Oras");
      if (this.repeat === "one") {
        this.queue.unshift(this.current);
      }
      if (this.repeat === "all") {
        this.queue.push(this.current);
      }
      this.previous = this.current;
      this.current = null;
      if (getAutoplay(this.guild.id).SETTING === 1) return this.autoplay();
      else this.play();
    });
    this.player.on("closed", () => this.destroy());
  }
  get oras() {
    return this.client.api.has(this.guild.id);
  }
  play() {
    if (!this.oras) return this.destroy();
    if (!this.queue.length) return;
    this.current = this.queue.shift();
    this.player.playTrack({ track: this.current.track });
  }
  async destroy() {
    this.queue.length = 0;
    this.previous = null;
    this.current = null;
    this.data
      .get("Oras")
      ?.delete()
      .catch(() => {});
    if (this.client.utils.checkDjSetup(this.guild.id) === true) {
      this.updateQueue(this.guild, this.queue);
      let set = this.client.utils.getDj(this.guild.id);
      let ch = await this.guild.channels.fetch(set.CHANNEL);
      ch.messages.fetch(set.MESSAGE).then((msg) =>
        msg.edit({
          embeds: [
            this.client.utils
              .embed()
              .setTitle(`Nothing Playing Right Now`)
              .setURL(`${this.client.config.voteUrl}`)
              .setImage(`${this.client.config.setupBgLink}`)
              .setAuthor({
                name: `| Now Playing`,
                iconURL: this.guild.iconURL({ dynamic: true }),
              })
              .setFooter({
                text: ` Thanks for choosing ${this.client.user.username}`,
                iconURL: this.client.user.displayAvatarURL(),
              }),
          ],
        }),
      );
    }
    this.player.connection.disconnect();
    this.client.api.delete(this.guild.id);
    if (this.client.utils.get247(this.guild.id) === true) {
      let node = this.client.shoukaku.getNode();
      return this.client.api.reconnect(
        this.guild,
        this.guild.channels.cache.get(get247Set(this.guild.id).CHANNELID),
        this.guild.channels.cache.get(get247Set(this.guild.id).TEXTID),
        node,
      );
    }
    if (this.stopped) return;
  }
  async updateQueue(guild, queue) {
    let setup = this.client.utils.checkDjSetup(guild?.id);
    if (setup) {
      let set = this.client.utils.getDj(guild?.id);
      let ch = await this.guild.channels.fetch(set.CHANNEL);
      if (ch) {
        let q;
        if (queue.length === 0 || !queue.length)
          q = `Join a Voice Channel and type in your Search Query or a Url`;
        else if (queue.length < 11)
          q = queue
            .map(
              (x, i) =>
                `**${i + 1}.** ${x.info.title.substring(
                  0,
                  35,
                )} .... *${this.client.utils.humanize(x.info.length)}*`,
            )
            .sort()
            .join("\n");
        else
          q =
            queue
              .slice(0, 9)
              .map(
                (x, i) =>
                  `**${i + 1}.** ${x.info.title.substring(
                    0,
                    35,
                  )} .... *${this.client.utils.humanize(x.info.length)}*`,
              )
              .sort()
              .join("\n") +
            `\n**${this.queue.length - 10}** Songs are upcoming in the queue`;
        ch.messages.fetch(set.MESSAGE).then((x) => {
          x.edit({
            content: `__**Queue List**__\n\n${q}`,
          });
        });
      }
    } else return;
  }
  async autoplay() {
    if (this.queue.length) return this.play();
    let identifier;
    if (this.previous === null) identifier = "_XBVWlI8TsQ";
    else
      identifier =
        this.previous.info.identifier || this.current.info.identifier;
    let url = `https://youtube.com/watch?v=${identifier}&list=RD${identifier}`;
    let node = this.client.shoukaku.getNode();
    let result = await node.rest.resolve(`${url}`);
    if (!result.tracks.length) return this.player.stopTrack();
    try {
      let track =
        result.tracks[
          Math.floor(Math.random() * Math.floor(result.tracks.length))
        ];
      track.info.requester = this.client.user;
      this.current = this.client.utils.track(track);
      this.player.playTrack({ track: this.current.track });
    } catch (e) {
      this.player.stopTrack();
    }
  }
}
//# sourceMappingURL=Dispatcher.js.map
