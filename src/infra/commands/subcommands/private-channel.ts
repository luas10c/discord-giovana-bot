import { FindChannelByOwnerId } from '#/domain/use-cases/find-channel-by-owner-id'
import { EmbedBuilder } from '@discordjs/builders'

const notification = new EmbedBuilder()

export class PrivateChannel {
  constructor(private readonly findChannelByOwnerId: FindChannelByOwnerId) {}

  async execute(interaction) {
    const value = interaction.options.getString('turn')

    const yourChannel = interaction.member.voice.channel
    if (value === 'on') {
      yourChannel.permissionOverwrites.edit(interaction.guild.id, {
        Connect: false
      })
      return await interaction.reply({
        embeds: [
          notification
            .setDescription('This channel is now private')
            .setColor([255, 0, 0])
        ],
        ephemeral: true
      })
    }

    if (value === 'off') {
      yourChannel.permissionOverwrites.edit(interaction.guild.id, {
        Connect: null
      })
      return await interaction.reply({
        embeds: [
          notification
            .setDescription('This channel is now public')
            .setColor([0, 0, 255])
        ],
        ephemeral: true
      })
    }
  }
}
