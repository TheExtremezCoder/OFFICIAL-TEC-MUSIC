import OrasCommand from "../../abstract/OrasCommand.js";
export default class Pause extends OrasCommand {
  constructor(client) {
    super(client);
    this.name = "pause";
    this.aliases = [];
    this.desc = "Pauses the current track";
    this.cat = "music";
    this.vc = true;
    this.samevc = true;
    this.dev = false;
    this.manage = false;
    this.dispatcher = true;
    this.playing = true;
    this.exec = async (message, args, prefix, dispatcher) => {
      if (dispatcher.player.paused)
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setDescription(
                `<:icons_cross:1204719930046423050> Player is Already **Paused** right now!`,
              ),
          ],
        });
      await dispatcher.player.setPaused(true);
      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `<:Check_Icon:1204720507623178290> Successfully **Paused** the Player!`,
            ),
        ],
      });
    };
  }
}
//# sourceMappingURL=Pause.js.map
