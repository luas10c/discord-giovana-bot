import { ChannelType } from '@discordjs/core'
import { EmbedBuilder } from '@discordjs/builders'

import { CreateChannel } from '../../../domain/use-cases/create-channel.js'
import { FindChannelByOwnerId } from '../../../domain/use-cases/find-channel-by-owner-id.js'

export class CreateChannelCommand {
  constructor(
    private readonly findChannelByOwnerId: FindChannelByOwnerId,
    private readonly createChannel: CreateChannel
  ) {}

  async execute(interaction, client) {
    const embed = new EmbedBuilder().setColor([0, 255, 0])

    const ownedChannel = await this.findChannelByOwnerId.execute({
      ownerId: interaction.user.id
    })

    if (ownedChannel) {
      const yourChannel = await client.channels.fetch(ownedChannel.channelId)
      await interaction.member.voice.setChannel(yourChannel)
      return await interaction.reply({
        embeds: [
          embed
            .setDescription('Channel found, you will be moved there.')
            .setColor([0, 255, 0])
        ],
        ephemeral: true
      })
    }

    const newChannel = await interaction.guild.channels.create({
      name: interaction.member.user.tag,
      type: ChannelType.GuildVoice,
      parent: '1054980057329840238',
      permissionOverwrites: [
        {
          id: interaction.member.id,
          allow: ['Connect']
        },
        {
          id: interaction.guild.id,
          deny: ['Connect']
        }
      ]
    })

    await this.createChannel.execute({
      channelId: newChannel.id,
      type: ChannelType.GuildVoice,
      ownerId: interaction.member.id
    })

    await interaction.member.voice.setChannel(newChannel)

    return await interaction.reply({
      embeds: [
        embed
          .setDescription('Channel created, you will be moved there.')
          .setColor([0, 255, 0])
      ],
      ephemeral: true
    })
  }
}
