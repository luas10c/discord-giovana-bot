import { EmbedBuilder } from '@discordjs/builders'

import { FindChannelByOwnerId } from '#/domain/use-cases/find-channel-by-owner-id'

const notification = new EmbedBuilder()

export class InviteMemberChannel {
  constructor(private readonly findByOwnerId: FindChannelByOwnerId) {}

  async execute(interaction) {
    const ownedChannel = await this.findByOwnerId.execute({
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

    if (!target) {
      await interaction.reply({
        embeds: [
          notification
            .setDescription(`target is not defined`)
            .setColor([255, 0, 0])
        ],
        ephemeral: true
      })
    }

    yourChannel.permissionOverwrites.edit(target, { Connect: true })

    await target.send({
      embeds: [
        notification.setDescription(
          `${interaction.member} as invited you to <#${interaction.member.voice.channel.id}>`
        )
      ]
    })

    await interaction.reply({
      embeds: [
        notification
          .setDescription(`${target} has been invited`)
          .setColor([0, 255, 0])
      ],
      ephemeral: true
    })
  }
}
