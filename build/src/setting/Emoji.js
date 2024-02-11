export default class OrasEmoji extends Object {
    constructor(client) {
        super();
        this.tick = "<:Check_Icon:1204720507623178290>";
        this.cross = "<:icons_cross:1204719930046423050>";
        this.playing = "<:Icon_Music:1205379321305370714>";
        this.exclamation = "<:icons:1205136577731362876>";
        this.queue = "<:queue:1205129253000183811>";
        this.info = "<:icons:1205136577731362876>";
        this.defSearch = "<:icons_youtube:1205130042229919764>";
        this.premium = "<:Icon_Premium:1204719583982911509>";
        this.invite = "<:icons_invite:1204747632111788043>";
        this.support = "<:Support:1166374880040734781>";
        this.spotiSearch = "<a:spotify:1169747235748184134>";
        this.deezSearch = "<:Deezer_oras:1065634451603861545>";
        this.vote = "<:voter:1166374882053984296>";
        this.soundSearch = "<:Soundcloud_oras:1065634569262473277>";
        this.badges = {
            named: "<:owner:1166375413778493501>",
            owner: "<:ownership:1169756062044410006>",
            dev: "<a:developer_bot:1166375405503139972>",
            admin: "<:ny_Admin:1166375418815856693>",
            codev: "<:Active_Dev:1166375415946940459>",
            author: "",
            friend: "<:bsdk_friends:1169758132260585613>",
            vip: "<:dc_Vipz:1169758685128577085>",
            premiumUser: "<:Icon_Premium:1204719583982911509>",
            mod: "<:mod_badge:1166375421986750564>",
            staff: "<:Staff:1166375424486539336>",
            supporter: "<:earlysupporter:1166375426956996619>",
            user: "<:kronix_member:1075040201195393074>",
        };
        this.helpMenu = {
            music: "<:Icon_Music:1205379321305370714>",
            home: "<:Home:1166377282726797323>",
            filters: "<:icons_control:1166377285499224164>",
            info: "<:icons:1205136577731362876>",
            utility: "<:settings:1166377288171004054>",
            allCommands: "<:icons_richpresence:1166377290662432809>",
        };
        this.setup = {
            pause: "<:ss_pause:1099927332204073011>",
            resume: "<:resume:1099927448734408744>",
            skip: "<:forward10:986893749005217812>",
            previous: "<:Oras_Previous:1137298056283430982>",
            shuffle: "<:shuffle:1139766210213462066>",
            author: "<:icons_queue:1166374069717958666>",
            nowPlaying: "<:kronix_member:1075040201195393074>",
            requester: "<:kronix_member:1075040201195393074>",
            duration: "<:duration333:1169749340923904060>",
            stop: "<:ss_stop:1099927856651436082>",
            loop: "<:loop:1129823572991426651>",
            volLow: "<:lower_vol:1139766602527690902>",
            volHigh: "<:higher_vol:1139766719917854751>",
            fav: "<:discotoolsxyzicon8:1158301800311566398>",
            autoplay: "<:emoji_05:1158269184715788388>",
            filters: "<:icons_control:1166377285499224164>",
        };
        this.orasNew = {
            emote: "<:Icon_Music:1205379321305370714>",
            nowPlaying: "<:Icon_Music:1205379321305370714>",
            requester: "<:kronix_member:1075040201195393074>",
            duration: "<:duration333:1169749340923904060>",
            author: "<:icons_queue:1166374069717958666>",
            pause: "<:Pause:1129824564386467991>",
            resume: "<:resume:1129824021618380801>",
            skip: "<:forward10:986893749005217812>",
            fav: "<:Icon_Premium:1204719583982911509>",
            previous: "<:Oras_Previous:1137298056283430982>",
            stop: "<:stop:1129823823399751690>",
        };
        this.spotify = {
            emote: "<:Icon_Music:1205379321305370714>",
            filters: "",
            nowPlaying: "<a:spotify:1169747235748184134>",
            requester: "<:kronix_member:1075040201195393074>",
            duration: "<:duration333:1169749340923904060>",
            pause: "<:ss_pause:1099927332204073011>",
            author: "<:icons_queue:1166374069717958666>",
            resume: "<:resume:1099927448734408744>",
            stop: "<:ss_stop:1099927856651436082>",
            loop: "<:loop:1129823572991426651>",
            shuffle: "<:shuffle:1139766210213462066>",
            forward: "<:backward:1129823401175949322>",
            backward: "<:forward10:1129823372008759327>",
            volLow: "<:lower_vol:1139766602527690902>",
            volHigh: "<:higher_vol:1139766719917854751>",
            previous: "<:Oras_Previous:1137298056283430982>",
            skip: "<:forward10:986893749005217812>",
        };
        this.special = {
            emote: "<:Icon_Music:1205379321305370714>",
            nowPlaying: "<:Icon_Music:1205379321305370714>",
            requester: "<:kronix_member:1075040201195393074>",
            duration: "<:duration333:1169749340923904060>",
            pause: "<:ss_pause:1099927332204073011>",
            author: "<:kronix_member:1075040201195393074>",
            resume: "<:resume:1099927448734408744>",
            stop: "<:ss_stop:1099927856651436082>",
            loop: "<:loop:1129823572991426651>",
            shuffle: "<:shuffle:1139766210213462066>",
            forward: "<:backward:1129823401175949322>",
            backward: "<:forward10:1129823372008759327>",
            volLow: "<:lower_vol:1139766602527690902>",
            volHigh: "<:higher_vol:1139766719917854751>",
            previous: "<:Oras_Previous:1137298056283430982>",
            skip: "<:last:1139768093766336632>",
        };
        this.noButtons = {
            emote: "<:Icon_Music:1205379321305370714>",
            nowPlaying: "<:kronix_member:1075040201195393074>",
            author: "<:icons_queue:1166374069717958666>",
            requester: "<:kronix_member:1075040201195393074>",
            duration: "<:duration333:1169749340923904060>",
            filters: "",
        };
        this.simple = {
            emote: "<:Icon_Music:1205379321305370714>",
            nowPlaying: "<:kronix_member:1075040201195393074>",
            requester: "<:kronix_member:1075040201195393074>",
            author: "<:icons_queue:1166374069717958666>",
            duration: "<:duration333:1169749340923904060>",
            filters: "",
            pause: "<:ss_pause:1099927332204073011>",
            resume: "<:resume:1099927448734408744>",
            stop: "<:stop:1129823823399751690>",
            skip: "<:skip:1099927755342233720>",
            loop: "<:loop:1129823572991426651>",
        };
        this.oldStyle = {
            emote: "<:Icon_Music:1205379321305370714>",
            nowPlaying: "<:kronix_member:1075040201195393074>",
            author: "<:icons_queue:1166374069717958666>",
            requester: "<:kronix_member:1075040201195393074>",
            duration: "<:duration333:1169749340923904060>",
        };
    }
}
//# sourceMappingURL=Emoji.js.map