export default class OrasConfig extends Object {
    token;
    prefix;
    nodes;
    spotiId;
    owners;
    spotiSecret;
    spotiNodes;
    webhooks;
    supportId;
    color;
    server;
    botinvite;
    voteUrl;
    voteApi;
    setupBgLink;
    constructor() {
        super();
        this.token =
            "MTIwMzY0NjYxOTUyMjgzNDQ1Mg.GrWDmO.8tZRQMdy8IYyCoC6xsdwB0yka3s_udNT8oyvmQ";
        this.botid = "1203646619522834452"
        this.prefix = ".";
        this.nodes = [
            {
                name: `Kronix`,
                url: `lava.link:80`,
                auth: `kronix`,
                secure: false,
            },
          {
              name: `TEC`,
              url: `lava.link:80`,
              auth: `ALVA`,
              secure: false,
          }, // Dont Change The Name Of Nodes
        ];
        this.voteApi =
            "";
        this.webhooks = {
            guildCreate: "https://discord.com/api/webhooks/1198586067507478599/-5E0UX35Mv_wMQQdYKkKnT57OjE0k34TRe0mb-1ELJLGA9-ARvFj61vhFC5b4hAKT9RW",
            guildDelete: "https://discord.com/api/webhooks/1198586067507478599/-5E0UX35Mv_wMQQdYKkKnT57OjE0k34TRe0mb-1ELJLGA9-ARvFj61vhFC5b4hAKT9RW",
            Cmds: "https://discord.com/api/webhooks/1198586067507478599/-5E0UX35Mv_wMQQdYKkKnT57OjE0k34TRe0mb-1ELJLGA9-ARvFj61vhFC5b4hAKT9RW",
        };
        this.server = "https://discord.gg/Yjt2EPmcWG";
        this.botinvite = `https://discord.com/api/oauth2/authorize?client_id=1203646619522834452&permissions=8&scope=bot+applications.commands`;
        this.spotiId = "731ac5bf0603411f80ac446f5c02e290";
        this.spotiSecret = "cd16a34c385b4fa5915abd596fd4e480";
        this.owners = ["1173547185758015498"];
        this.color = "#45FFCA";
        this.supportId = "1173554067910438912"; //Server Id
        this.spotiNodes = [
            {
                id: `Kronix`,
                host: `lava.link`,
                port: 80,
                password: `kronix`,
                secure: false,
            },
          {
              id: `Oras`,
              host: `lava.link`,
              port: 80,
              password: `kronix`,
              secure: false,
          }, // Dont Change The Name Of Nodes
        ];
        this.voteUrl = "https://top.gg/bot/1203646619522834452/vote";
        this.setupBgLink =
            "https://media.discordapp.net/attachments/1162795987014787162/1205424655679234088/gg.png?ex=65d85231&is=65c5dd31&hm=9746958b5c53418205d11bc9170b0c32b911e484bef10e2b3e26d530b37efd84&=&format=webp&quality=lossless&width=1440&height=405";
    }
}
//# sourceMappingURL=Config.js.map