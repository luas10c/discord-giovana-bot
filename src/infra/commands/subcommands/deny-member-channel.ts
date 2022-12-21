import { FindChannelByOwnerId } from '#/domain/use-cases/find-channel-by-owner-id'
import { EmbedBuilder } from '@discordjs/builders'

const notification = new EmbedBuilder()

export class DenyMemberChannel {
  constructor(private readonly findChannelByOwnerId: FindChannelByOwnerId) {}

  async execute(interaction) {
    const ownedChannel = await this.findChannelByOwnerId.execute({
      ownerId: interaction.member.id
    })

    if (!ownedChannel) {
      return interaction.reply({
        embeds: [
          notification
            .setDescription('You do not own this, or any channel.')
            .setColor([255, 0, 0])
        ],
        ephemeral: true
      })
    }

    const ownedChannelId = interaction.member.voice.channel.id
    if (ownedChannelId !== ownedChannel.channelId) {
      return interaction.reply({
        embeds: [
          notification
            .setDescription('You do not own this, or any channel.')
            .setColor([255, 0, 0])
        ],
        ephemeral: true
      })
    }

    const target = interaction.options.getMember('member')
    const yourChannel = interaction.member.voice.channel
    yourChannel.permissionOverwrites.edit(target, { Connect: null })

    await target.voice.setChannel(null)

    await interaction.reply({
      embeds: [
        notification
          .setDescription(`<#${target}> can no longer join your channel.`)
          .setColor([255, 0, 0])
      ],
      ephemeral: true
    })
  }
}
